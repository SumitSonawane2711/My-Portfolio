import "server-only";
import { db } from "@/shared/libs/db";
import type { Prisma } from "@/generated/prisma/client";
import type { FeedStory } from "../services/mediumFeed";

const storySelect = {
  id: true,
  url: true,
  title: true,
  excerpt: true,
  coverUrl: true,
  tags: true,
  publishedAt: true,
  featured: true,
} satisfies Prisma.MediumPostSelect;

const adminSelect = {
  ...storySelect,
  source: true,
  hidden: true,
} satisfies Prisma.MediumPostSelect;

export const mediumRepository = {
  /** Visible stories, newest first; `featuredFirst` for the home page. */
  listVisible({ take, featuredFirst = false }: { take?: number; featuredFirst?: boolean } = {}) {
    return db.mediumPost.findMany({
      where: { hidden: false },
      orderBy: featuredFirst
        ? [{ featured: "desc" }, { publishedAt: "desc" }]
        : { publishedAt: "desc" },
      take,
      select: storySelect,
    });
  },

  listAll() {
    return db.mediumPost.findMany({ orderBy: { publishedAt: "desc" }, select: adminSelect });
  },

  findById(id: string) {
    return db.mediumPost.findUnique({ where: { id }, select: { id: true, source: true } });
  },

  existingGuids(guids: string[]) {
    return db.mediumPost
      .findMany({ where: { guid: { in: guids } }, select: { guid: true } })
      .then((rows) => new Set(rows.map((r) => r.guid)));
  },

  guidExists(guid: string, exceptId?: string) {
    return db.mediumPost
      .count({ where: { guid, ...(exceptId && { id: { not: exceptId } }) } })
      .then((n) => n > 0);
  },

  /**
   * Inserts new feed stories and refreshes known ones. Admin choices (hidden,
   * featured) and the source of hand-added rows are never touched.
   */
  upsertFromFeed(stories: FeedStory[]) {
    return db.$transaction(
      stories.map(({ guid, ...story }) =>
        db.mediumPost.upsert({
          where: { guid },
          create: { guid, ...story, source: "RSS" },
          update: story,
        }),
      ),
    );
  },

  create(data: Prisma.MediumPostCreateInput) {
    return db.mediumPost.create({ data, select: { id: true } });
  },

  update(id: string, data: Prisma.MediumPostUpdateInput) {
    return db.mediumPost.update({ where: { id }, data, select: { id: true } });
  },

  delete(id: string) {
    return db.mediumPost.delete({ where: { id } });
  },
};
