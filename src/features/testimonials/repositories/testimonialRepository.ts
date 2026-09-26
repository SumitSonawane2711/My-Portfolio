import "server-only";
import { db } from "@/shared/libs/db";
import type { Prisma } from "@/generated/prisma/client";
import { mediaSelect } from "@/features/media/repositories/mediaRepository";

export const testimonialRepository = {
  listVisible() {
    return db.testimonial.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      include: { avatar: { select: { publicId: true } } },
    });
  },

  list() {
    return db.testimonial.findMany({
      orderBy: { order: "asc" },
      include: { avatar: { select: mediaSelect } },
    });
  },

  findById(id: string) {
    return db.testimonial.findUnique({ where: { id } });
  },

  async maxOrder() {
    const { _max } = await db.testimonial.aggregate({ _max: { order: true } });
    return _max.order ?? -1;
  },

  create(data: Prisma.TestimonialCreateInput) {
    return db.testimonial.create({ data });
  },

  update(id: string, data: Prisma.TestimonialUpdateInput) {
    return db.testimonial.update({ where: { id }, data });
  },

  delete(id: string) {
    return db.testimonial.delete({ where: { id } });
  },

  reorder(ids: string[]) {
    return db.$transaction(
      ids.map((id, order) => db.testimonial.update({ where: { id }, data: { order } })),
    );
  },
};
