import "server-only";
import { db } from "@/shared/libs/db";
import type { Prisma } from "@/generated/prisma/client";

export const mediaSelect = {
  id: true,
  publicId: true,
  resourceType: true,
  format: true,
  width: true,
  height: true,
  bytes: true,
  alt: true,
} satisfies Prisma.MediaAssetSelect;

// Every relation that can reference a media asset. Keep in sync with the schema.
const unusedWhere = {
  projectCovers: { none: {} },
  projectImages: { none: {} },
  postCovers: { none: {} },
  experienceLogos: { none: {} },
  testimonialAvatars: { none: {} },
  technologyIcons: { none: {} },
  resumes: { none: {} },
  settingsAvatars: { none: {} },
  settingsOgImages: { none: {} },
} satisfies Prisma.MediaAssetWhereInput;

const usageCount = {
  _count: {
    select: {
      projectCovers: true,
      projectImages: true,
      postCovers: true,
      experienceLogos: true,
      testimonialAvatars: true,
      technologyIcons: true,
      resumes: true,
      settingsAvatars: true,
      settingsOgImages: true,
    },
  },
} satisfies Prisma.MediaAssetInclude;

export const mediaRepository = {
  upsertByPublicId(data: Prisma.MediaAssetCreateInput) {
    return db.mediaAsset.upsert({
      where: { publicId: data.publicId },
      create: data,
      update: {
        format: data.format,
        width: data.width,
        height: data.height,
        bytes: data.bytes,
      },
      select: mediaSelect,
    });
  },

  findById(id: string) {
    return db.mediaAsset.findUnique({ where: { id }, select: mediaSelect });
  },

  listWithUsage() {
    return db.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
      include: usageCount,
    });
  },

  isUnused(id: string) {
    return db.mediaAsset.count({ where: { id, ...unusedWhere } }).then((count) => count === 1);
  },

  listUnused(olderThan: Date) {
    return db.mediaAsset.findMany({
      where: { ...unusedWhere, createdAt: { lt: olderThan } },
      select: { id: true, publicId: true, resourceType: true },
    });
  },

  setAlt(id: string, alt: string | null) {
    return db.mediaAsset.update({ where: { id }, data: { alt }, select: mediaSelect });
  },

  delete(id: string) {
    return db.mediaAsset.delete({ where: { id } });
  },
};
