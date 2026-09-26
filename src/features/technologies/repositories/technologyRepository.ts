import "server-only";
import { db } from "@/shared/libs/db";
import type { Prisma } from "@/generated/prisma/client";
import { mediaSelect } from "@/features/media/repositories/mediaRepository";

export const technologyBadgeSelect = {
  name: true,
  slug: true,
  icon: true,
  color: true,
  customIcon: { select: { publicId: true } },
} satisfies Prisma.TechnologySelect;

export const technologyRepository = {
  list() {
    return db.technology.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: {
        customIcon: { select: mediaSelect },
        _count: { select: { projects: true, experiences: true } },
      },
    });
  },

  findById(id: string) {
    return db.technology.findUnique({ where: { id } });
  },

  async nameOrSlugTaken(name: string, slug: string, exceptId?: string) {
    const found = await db.technology.findFirst({
      where: {
        OR: [{ name: { equals: name, mode: "insensitive" } }, { slug }],
        ...(exceptId && { NOT: { id: exceptId } }),
      },
      select: { id: true },
    });
    return Boolean(found);
  },

  async slugExists(slug: string) {
    return Boolean(await db.technology.findUnique({ where: { slug }, select: { id: true } }));
  },

  async maxOrder() {
    const { _max } = await db.technology.aggregate({ _max: { order: true } });
    return _max.order ?? -1;
  },

  create(data: Prisma.TechnologyCreateInput) {
    return db.technology.create({ data });
  },

  update(id: string, data: Prisma.TechnologyUpdateInput) {
    return db.technology.update({ where: { id }, data });
  },

  delete(id: string) {
    return db.technology.delete({ where: { id } });
  },

  usageCount(id: string) {
    return db.technology
      .findUnique({
        where: { id },
        select: { _count: { select: { projects: true, experiences: true } } },
      })
      .then((t) => (t ? t._count.projects + t._count.experiences : 0));
  },

  reorder(ids: string[]) {
    return db.$transaction(
      ids.map((id, index) => db.technology.update({ where: { id }, data: { order: index } })),
    );
  },
};
