import "server-only";
import { db } from "@/shared/libs/db";
import type { Prisma } from "@/generated/prisma/client";
import { mediaSelect } from "@/features/media/repositories/mediaRepository";

const withFile = { file: { select: mediaSelect } } satisfies Prisma.ResumeInclude;
const listOrder = [
  { order: "asc" },
  { createdAt: "asc" },
] satisfies Prisma.ResumeOrderByWithRelationInput[];

export type ResumeWithFile = Prisma.ResumeGetPayload<{ include: typeof withFile }>;

export const resumeRepository = {
  list() {
    return db.resume.findMany({ orderBy: listOrder, include: withFile });
  },

  listActive() {
    return db.resume.findMany({
      where: { status: "ACTIVE" },
      orderBy: listOrder,
      include: withFile,
    });
  },

  /** The primary resume, or the first active one when none is marked primary. */
  async findDefault() {
    return (
      (await db.resume.findFirst({
        where: { isPrimary: true, status: "ACTIVE" },
        include: withFile,
      })) ??
      (await db.resume.findFirst({
        where: { status: "ACTIVE" },
        orderBy: listOrder,
        include: withFile,
      }))
    );
  },

  /** ACTIVE or UNLISTED (archived resumes are not reachable publicly). */
  findPublicBySlug(slug: string) {
    return db.resume.findFirst({
      where: { slug, status: { in: ["ACTIVE", "UNLISTED"] } },
      include: withFile,
    });
  },

  findById(id: string) {
    return db.resume.findUnique({ where: { id } });
  },

  async slugExists(slug: string, exceptId?: string) {
    const found = await db.resume.findFirst({
      where: { slug, ...(exceptId && { NOT: { id: exceptId } }) },
      select: { id: true },
    });
    return Boolean(found);
  },

  async maxOrder() {
    const { _max } = await db.resume.aggregate({ _max: { order: true } });
    return _max.order ?? -1;
  },

  hasPrimary() {
    return db.resume.count({ where: { isPrimary: true } }).then((n) => n > 0);
  },

  create(data: Prisma.ResumeUncheckedCreateInput) {
    return db.resume.create({ data });
  },

  update(id: string, data: Prisma.ResumeUncheckedUpdateInput) {
    return db.resume.update({ where: { id }, data });
  },

  /** Makes `id` the only primary resume (single transaction). */
  setPrimary(id: string) {
    return db.$transaction([
      db.resume.updateMany({ where: { isPrimary: true, NOT: { id } }, data: { isPrimary: false } }),
      db.resume.update({ where: { id }, data: { isPrimary: true, status: "ACTIVE" } }),
    ]);
  },

  firstActiveId(exceptId?: string) {
    return db.resume
      .findFirst({
        where: { status: "ACTIVE", ...(exceptId && { NOT: { id: exceptId } }) },
        orderBy: listOrder,
        select: { id: true },
      })
      .then((r) => r?.id ?? null);
  },

  delete(id: string) {
    return db.resume.delete({ where: { id } });
  },

  reorder(ids: string[]) {
    return db.$transaction(
      ids.map((id, order) => db.resume.update({ where: { id }, data: { order } })),
    );
  },

  incrementDownloads(id: string) {
    return db.resume.update({ where: { id }, data: { downloadCount: { increment: 1 } } });
  },
};
