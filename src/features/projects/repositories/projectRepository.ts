import "server-only";
import { db } from "@/shared/libs/db";
import type { Prisma } from "@/generated/prisma/client";
import { mediaSelect } from "@/features/media/repositories/mediaRepository";
import { technologyBadgeSelect } from "@/features/technologies/repositories/technologyRepository";

const cardSelect = {
  title: true,
  slug: true,
  summary: true,
  displayDate: true,
  cover: { select: { publicId: true, alt: true } },
  technologies: { select: technologyBadgeSelect, orderBy: { order: "asc" } },
} satisfies Prisma.ProjectSelect;

const detailSelect = {
  ...cardSelect,
  subtitle: true,
  contentHtml: true,
  toc: true,
  liveUrl: true,
  repoUrl: true,
  seoTitle: true,
  seoDescription: true,
  updatedAt: true,
  images: { select: { media: { select: { publicId: true } } }, orderBy: { order: "asc" } },
} satisfies Prisma.ProjectSelect;

export type ProjectCardRow = Prisma.ProjectGetPayload<{ select: typeof cardSelect }>;
export type ProjectDetailRow = Prisma.ProjectGetPayload<{ select: typeof detailSelect }>;

const published = { published: true } satisfies Prisma.ProjectWhereInput;

export const projectRepository = {
  // ── Public ───────────────────────────────────────────────────────────
  listPublished(take?: number) {
    return db.project.findMany({
      where: published,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take,
      select: cardSelect,
    });
  },

  /** Featured first, then by order — for the home page. */
  listForHome(take: number) {
    return db.project.findMany({
      where: published,
      orderBy: [{ featured: "desc" }, { order: "asc" }],
      take,
      select: cardSelect,
    });
  },

  findPublishedBySlug(slug: string) {
    return db.project.findFirst({ where: { slug, ...published }, select: detailSelect });
  },

  listPublishedSlugs() {
    return db.project.findMany({ where: published, select: { slug: true, updatedAt: true } });
  },

  // ── Admin ────────────────────────────────────────────────────────────
  listForAdmin() {
    return db.project.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        featured: true,
        displayDate: true,
        cover: { select: { publicId: true } },
      },
    });
  },

  findForEdit(id: string) {
    return db.project.findUnique({
      where: { id },
      include: {
        cover: { select: mediaSelect },
        images: { include: { media: { select: mediaSelect } }, orderBy: { order: "asc" } },
        technologies: { select: { id: true } },
      },
    });
  },

  findById(id: string) {
    return db.project.findUnique({
      where: { id },
      select: { id: true, slug: true, coverId: true, images: { select: { mediaId: true } } },
    });
  },

  async slugExists(slug: string, exceptId?: string) {
    const found = await db.project.findFirst({
      where: { slug, ...(exceptId && { NOT: { id: exceptId } }) },
      select: { id: true },
    });
    return Boolean(found);
  },

  async maxOrder() {
    const { _max } = await db.project.aggregate({ _max: { order: true } });
    return _max.order ?? -1;
  },

  create(data: Prisma.ProjectCreateInput) {
    return db.project.create({ data, select: { id: true, slug: true } });
  },

  /** Updates fields and replaces the gallery in one transaction. */
  update(id: string, data: Prisma.ProjectUpdateInput, imageIds: string[]) {
    return db.$transaction(async (tx) => {
      await tx.projectImage.deleteMany({ where: { projectId: id } });
      return tx.project.update({
        where: { id },
        data: {
          ...data,
          images: { create: imageIds.map((mediaId, order) => ({ mediaId, order })) },
        },
        select: { id: true, slug: true },
      });
    });
  },

  delete(id: string) {
    return db.project.delete({ where: { id } });
  },

  reorder(ids: string[]) {
    return db.$transaction(
      ids.map((id, order) => db.project.update({ where: { id }, data: { order } })),
    );
  },
};
