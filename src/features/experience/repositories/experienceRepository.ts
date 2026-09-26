import "server-only";
import { db } from "@/shared/libs/db";
import type { Prisma } from "@/generated/prisma/client";

const cardSelect = {
  company: true,
  slug: true,
  role: true,
  companyUrl: true,
  startDate: true,
  endDate: true,
  summary: true,
  contentHtml: true,
  location: true,
  updatedAt: true,
  technologies: { select: { name: true }, orderBy: { order: "asc" } },
} satisfies Prisma.ExperienceSelect;

export type ExperienceRow = Prisma.ExperienceGetPayload<{ select: typeof cardSelect }>;

const published = { published: true } satisfies Prisma.ExperienceWhereInput;
// Most recent role first; current roles (no end date) before finished ones.
const newestFirst = [
  { endDate: { sort: "desc", nulls: "first" } },
  { startDate: "desc" },
] satisfies Prisma.ExperienceOrderByWithRelationInput[];

export const experienceRepository = {
  listPublished() {
    return db.experience.findMany({ where: published, orderBy: newestFirst, select: cardSelect });
  },

  findPublishedBySlug(slug: string) {
    return db.experience.findFirst({ where: { slug, ...published }, select: cardSelect });
  },

  async earliestStartDate() {
    const { _min } = await db.experience.aggregate({
      where: published,
      _min: { startDate: true },
    });
    return _min.startDate;
  },

  listForAdmin() {
    return db.experience.findMany({
      orderBy: newestFirst,
      select: {
        id: true,
        company: true,
        role: true,
        startDate: true,
        endDate: true,
        published: true,
      },
    });
  },

  findForEdit(id: string) {
    return db.experience.findUnique({
      where: { id },
      include: { technologies: { select: { id: true } } },
    });
  },

  findById(id: string) {
    return db.experience.findUnique({
      where: { id },
      select: { id: true, slug: true, logoId: true },
    });
  },

  async slugExists(slug: string, exceptId?: string) {
    const found = await db.experience.findFirst({
      where: { slug, ...(exceptId && { NOT: { id: exceptId } }) },
      select: { id: true },
    });
    return Boolean(found);
  },

  create(data: Prisma.ExperienceCreateInput) {
    return db.experience.create({ data, select: { id: true, slug: true } });
  },

  update(id: string, data: Prisma.ExperienceUpdateInput) {
    return db.experience.update({ where: { id }, data, select: { id: true, slug: true } });
  },

  delete(id: string) {
    return db.experience.delete({ where: { id } });
  },
};
