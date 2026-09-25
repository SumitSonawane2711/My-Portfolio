import "server-only";
import { cache } from "react";
import type { JSONContent } from "@tiptap/react";
import type { PostAdminRow, PostFormData } from "../interfaces/blog";
import { blogRepository } from "../repositories/blogRepository";
import { isPlaceholderSlug, toBlogCard, toBlogPost } from "../services/blogServices";

// ── Public ───────────────────────────────────────────────────────────────

export const getLatestPosts = cache(async (take = 3) =>
  (await blogRepository.listVisible({ take })).map(toBlogCard),
);

export const getPosts = cache(async () => (await blogRepository.listVisible()).map(toBlogCard));

export const getPostsByTag = cache(async (tagSlug: string) => {
  const tag = await blogRepository.findTagBySlug(tagSlug);
  if (!tag) return null;
  return { tag, posts: (await blogRepository.listVisible({ tagSlug })).map(toBlogCard) };
});

export const getPost = cache(async (slug: string) => {
  const row = await blogRepository.findVisibleBySlug(slug);
  return row ? toBlogPost(row) : null;
});

export const getRelatedPosts = cache(async (postId: string, tagSlugs: string[]) =>
  (await blogRepository.findRelated(postId, tagSlugs)).map(toBlogCard),
);

export const getPostSlugs = cache(() => blogRepository.listVisibleSlugs());

export const getTags = cache(() => blogRepository.listVisibleTags());

// ── Admin ────────────────────────────────────────────────────────────────

export async function getPostsForAdmin(status?: string): Promise<PostAdminRow[]> {
  const filter =
    status === "DRAFT" || status === "PUBLISHED" || status === "SCHEDULED" ? status : undefined;
  const rows = await blogRepository.listForAdmin(filter);
  return rows.map(({ _count, ...row }) => ({ ...row, likes: _count.likes }));
}

export async function getPostForEdit(id: string): Promise<PostFormData | null> {
  const row = await blogRepository.findForEdit(id);
  if (!row) return null;
  return {
    id: row.id,
    title: row.title === "Untitled" && !row.contentHtml ? "" : row.title,
    slug: isPlaceholderSlug(row.slug) ? "" : row.slug,
    excerpt: row.excerpt,
    cover: row.cover,
    contentJson: (row.contentJson as JSONContent | null) ?? null,
    contentHtml: row.contentHtml,
    tags: row.tags.map((t) => t.name),
    status: row.status,
    publishedAt: row.publishedAt?.toISOString() ?? "",
    seoTitle: row.seoTitle ?? "",
    seoDescription: row.seoDescription ?? "",
  };
}

/** Any status — for the admin preview. */
export async function getPostForPreview(id: string) {
  const row = await blogRepository.findById(id);
  return row ? { ...toBlogPost(row), status: row.status } : null;
}

export const getAllTagNames = async () =>
  (await blogRepository.listAllTagNames()).map((t) => t.name);
