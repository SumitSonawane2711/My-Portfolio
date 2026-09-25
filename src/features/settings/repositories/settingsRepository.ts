import "server-only";
import { db } from "@/shared/libs/db";
import type { Prisma } from "@/generated/prisma/client";
import { mediaSelect } from "@/features/media/repositories/mediaRepository";

const withMedia = {
  avatar: { select: mediaSelect },
  ogImage: { select: mediaSelect },
} satisfies Prisma.SiteSettingsInclude;

export const settingsRepository = {
  /** The single settings row (id 1), created on first read. */
  get() {
    return db.siteSettings.upsert({
      where: { id: 1 },
      create: { id: 1 },
      update: {},
      include: withMedia,
    });
  },

  update(data: Prisma.SiteSettingsUpdateInput) {
    return db.siteSettings.update({ where: { id: 1 }, data });
  },
};
