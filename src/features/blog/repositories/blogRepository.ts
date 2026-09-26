import "server-only";
import { db } from "@/shared/libs/db";
import type { Prisma } from "@/generated/prisma/client";
import { mediaSelect } from "@/features/media/repositories/mediaRepository";

/** Visible to visitors: published or scheduled, and the date has passed. */
export const visibleWhere = (now = new Date()): Prisma.PostWhereInput => ({
  status: { in: ["PUBLISHED", "SCHEDULED"] },
  publishedAt: { lte: now },
});

const tagSelect = { select: { name: true, slug: true }, orderBy: { name: "asc" } } as const;

const cardSelect = {
  title: true,
  slug: true,
  excerpt: true,
  publishedAt: true,
  readingMinutes: true,
  tags: tagSelect,
} satisfies Prisma.PostSelect;

const postSelect = {
  ...cardSelect,
  id: true,
  cover: { select: { publicId: true, alt: true, width: true, height: true } },
  contentHtml: true,
  toc: true,
  seoTitle: true,
  seoDescription: true,
  updatedAt: true,
} satisfies Prisma.PostSelect;

export type PostCardRow = Prisma.PostGetPayload<{ select: typeof cardSelect }>;
export type PostRow = Prisma.PostGetPayload<{ select: typeof postSelect }>;

export const blogRepository = {
  // ── Public ───────────────────────────────────────────────────────────
  listVisible({ tagSlug, take }: { tagSlug?: string; take?: number } = {}) {
    return db.post.findMany({
      where: { ...visibleWhere(), ...(tagSlug && { tags: { some: { slug: tagSlug } } }) },
      orderBy: { publishedAt: "desc" },
      take,
      select: cardSelect,
    });
  },

  /** Latest visible posts with full HTML, for the RSS feed. */
  listVisibleForFeed(take: number) {
    return db.post.findMany({
      where: visibleWhere(),
      orderBy: { publishedAt: "desc" },
      take,
      select: {
        title: true,
        slug: true,
        excerpt: true,
        contentHtml: true,
        publishedAt: true,
        updatedAt: true,
        tags: tagSelect,
      },
    });
  },

  findVisibleBySlug(slug: string) {
    return db.post.findFirst({ where: { slug, ...visibleWhere() }, select: postSelect });
  },

  listVisibleSlugs() {
    return db.post.findMany({ where: visibleWhere(), select: { slug: true, updatedAt: true } });
  },

  /** Posts sharing a tag with this one, newest first. */
  findRelated(postId: string, tagSlugs: string[], take = 3) {
    if (tagSlugs.length === 0) return Promise.resolve([]);
    return db.post.findMany({
      where: { ...visibleWhere(), id: { not: postId }, tags: { some: { slug: { in: tagSlugs } } } },
      orderBy: { publishedAt: "desc" },
      take,
      select: { ...cardSelect, id: true },
    });
  },

  /** Latest visible posts except the given ids (fills up "related posts"). */
  listLatestExcept(excludeIds: string[], take: number) {
    if (take <= 0) return Promise.resolve([]);
    return db.post.findMany({
      where: { ...visibleWhere(), id: { notIn: excludeIds } },
      orderBy: { publishedAt: "desc" },
      take,
      select: { ...cardSelect, id: true },
    });
  },

  /** Tags used by at least one visible post. */
  listVisibleTags() {
    return db.tag.findMany({
      where: { posts: { some: visibleWhere() } },
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    });
  },

  findTagBySlug(slug: string) {
    return db.tag.findUnique({ where: { slug }, select: { name: true, slug: true } });
  },

  // ── Admin ────────────────────────────────────────────────────────────
  listForAdmin(status?: "DRAFT" | "PUBLISHED" | "SCHEDULED") {
    return db.post.findMany({
      where: status ? { status } : undefined,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        publishedAt: true,
        readingMinutes: true,
        updatedAt: true,
        _count: { select: { likes: true } },
      },
    });
  },

  findForEdit(id: string) {
    return db.post.findUnique({
      where: { id },
      include: { cover: { select: mediaSelect }, tags: { select: { name: true } } },
    });
  },

  /** Draft preview: any status. */
  findById(id: string) {
    return db.post.findUnique({
      where: { id },
      select: { ...postSelect, status: true, coverId: true },
    });
  },

  listAllTagNames() {
    return db.tag.findMany({ orderBy: { name: "asc" }, select: { name: true } });
  },

  async slugExists(slug: string, exceptId?: string) {
    const found = await db.post.findFirst({
      where: { slug, ...(exceptId && { NOT: { id: exceptId } }) },
      select: { id: true },
    });
    return Boolean(found);
  },

  create(data: Prisma.PostCreateInput) {
    return db.post.create({ data, select: { id: true, slug: true } });
  },

  update(id: string, data: Prisma.PostUpdateInput) {
    return db.post.update({
      where: { id },
      data,
      select: { id: true, slug: true, status: true, publishedAt: true },
    });
  },

  delete(id: string) {
    return db.post.delete({ where: { id } });
  },
};
