import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { processContent, type TocItem } from "@/shared/libs/content/process";
import { AppError } from "@/shared/libs/errors";
import { slugify, uniqueSlug } from "@/shared/libs/slug";
import { mediaServices } from "@/features/media/services/mediaServices";
import type { BlogCard, BlogPost } from "../interfaces/blog";
import { blogRepository, type PostCardRow, type PostRow } from "../repositories/blogRepository";
import type { AutosaveInput, PostInput } from "../schemas/blogSchema";
import { excerptFrom, isVisible, PublishRuleError, resolvePublishState } from "./publishRules";

// ── Mappers ──────────────────────────────────────────────────────────────

export const toBlogCard = (row: PostCardRow): BlogCard => ({
  title: row.title,
  slug: row.slug,
  excerpt: row.excerpt,
  // Visible posts always have a date (see visibleWhere).
  publishedAt: row.publishedAt ?? new Date(0),
  readingMinutes: row.readingMinutes,
  tags: row.tags,
});

export const toBlogPost = (row: PostRow): BlogPost => ({
  ...toBlogCard(row),
  id: row.id,
  coverPublicId: row.cover?.publicId ?? null,
  coverAlt: row.cover?.alt ?? null,
  coverWidth: row.cover?.width ?? null,
  coverHeight: row.cover?.height ?? null,
  contentHtml: row.contentHtml,
  toc: (row.toc as TocItem[]) ?? [],
  seoTitle: row.seoTitle,
  seoDescription: row.seoDescription,
  updatedAt: row.updatedAt,
});

// ── Rules ────────────────────────────────────────────────────────────────

/** Auto-generated draft slugs ("untitled", "untitled-2") are replaced from the title. */
export const isPlaceholderSlug = (slug: string) => /^untitled(-\d+)?$/.test(slug);

async function contentFields(input: { contentJson: unknown; contentHtml: string }) {
  const processed = await processContent(input.contentHtml);
  return {
    processed,
    data: {
      contentJson: (input.contentJson ?? undefined) as Prisma.InputJsonValue | undefined,
      contentHtml: processed.html,
      toc: processed.toc as unknown as Prisma.InputJsonValue,
      readingMinutes: processed.readingMinutes,
    },
  };
}

// Tags are matched by slug and created on the fly.
const tagsField = (names: string[]) => {
  const unique = new Map(names.map((name) => [slugify(name), name.trim()]));
  return {
    set: [],
    connectOrCreate: [...unique].map(([slug, name]) => ({
      where: { slug },
      create: { slug, name },
    })),
  };
};

export const blogServices = {
  async createDraft() {
    const slug = await uniqueSlug("untitled", (s) => blogRepository.slugExists(s));
    return blogRepository.create({ title: "Untitled", slug, status: "DRAFT" });
  },

  /** Full save from the editor. Returns slugs and visibility so callers can revalidate. */
  async save(id: string, input: PostInput) {
    const existing = await blogRepository.findById(id);
    if (!existing) throw new AppError("Post not found.", "NOT_FOUND");

    let publish;
    try {
      publish = resolvePublishState(
        {
          status: input.status,
          publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
        },
        existing.publishedAt,
      );
    } catch (error) {
      if (error instanceof PublishRuleError) throw new AppError(error.message);
      throw error;
    }

    // The slug only changes when edited explicitly — except placeholder draft
    // slugs, which follow the title — so published links never break.
    const wanted = input.slug || (isPlaceholderSlug(existing.slug) ? input.title : existing.slug);
    const slug =
      slugify(wanted) === existing.slug
        ? existing.slug
        : await uniqueSlug(wanted, (s) => blogRepository.slugExists(s, id));

    const { processed, data } = await contentFields(input);
    const updated = await blogRepository.update(id, {
      ...data,
      title: input.title,
      slug,
      excerpt: input.excerpt || excerptFrom(processed.plainText),
      status: publish.status,
      publishedAt: publish.publishedAt,
      seoTitle: input.seoTitle || null,
      seoDescription: input.seoDescription || null,
      tags: tagsField(input.tags),
      cover: input.coverId ? { connect: { id: input.coverId } } : { disconnect: true },
    });

    if (existing.coverId !== input.coverId) await mediaServices.releaseIfUnused(existing.coverId);

    return {
      oldSlug: existing.slug,
      slug: updated.slug,
      status: updated.status,
      wasVisible: isVisible(existing),
      isVisible: isVisible(updated),
    };
  },

  /** Title + content only; status and dates are untouched. */
  async autosave(id: string, input: AutosaveInput) {
    const existing = await blogRepository.findById(id);
    if (!existing) throw new AppError("Post not found.", "NOT_FOUND");
    const { data } = await contentFields(input);
    await blogRepository.update(id, { ...data, title: input.title });
    return { slug: existing.slug, isVisible: isVisible(existing) };
  },

  async unpublish(id: string) {
    const existing = await blogRepository.findById(id);
    if (!existing) throw new AppError("Post not found.", "NOT_FOUND");
    await blogRepository.update(id, { status: "DRAFT" });
    return { slug: existing.slug };
  },

  async delete(id: string) {
    const existing = await blogRepository.findById(id);
    if (!existing) throw new AppError("Post not found.", "NOT_FOUND");
    // Likes cascade; reader messages keep their text with postId = null.
    await blogRepository.delete(id);
    await mediaServices.releaseIfUnused(existing.coverId);
    return { slug: existing.slug };
  },
};
