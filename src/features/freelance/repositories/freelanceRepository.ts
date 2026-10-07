import "server-only";
import { db } from "@/shared/libs/db";
import type { Prisma } from "@/generated/prisma/client";
import { mediaSelect } from "@/features/media/repositories/mediaRepository";
import { technologyBadgeSelect } from "@/features/technologies/repositories/technologyRepository";

const settingsInclude = {
  portrait: { select: mediaSelect },
  ogImage: { select: mediaSelect },
} satisfies Prisma.FreelanceSettingsInclude;

const byOrder = [
  { order: "asc" },
  { createdAt: "asc" },
] satisfies Prisma.FreelanceServiceOrderByWithRelationInput[];

export const freelanceRepository = {
  /** The single settings row (created empty if it's missing). */
  async getSettings() {
    return (
      (await db.freelanceSettings.findUnique({ where: { id: 1 }, include: settingsInclude })) ??
      db.freelanceSettings.upsert({
        where: { id: 1 },
        create: { id: 1 },
        update: {},
        include: settingsInclude,
      })
    );
  },

  updateSettings(data: Prisma.FreelanceSettingsUpdateInput) {
    return db.freelanceSettings.update({ where: { id: 1 }, data });
  },

  // ── Public lists ─────────────────────────────────────────────────────
  listVisibleServices() {
    return db.freelanceService.findMany({ where: { visible: true }, orderBy: byOrder });
  },

  listVisibleOffers() {
    return db.freelanceOffer.findMany({ where: { visible: true }, orderBy: byOrder });
  },

  listWork() {
    return db.project.findMany({
      where: { published: true, freelance: true },
      // The admin's project order; the carousel shows three at most.
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take: 3,
      select: {
        slug: true,
        title: true,
        summary: true,
        clientName: true,
        outcome: true,
        displayDate: true,
        liveUrl: true,
        previewVideo: { select: { publicId: true } },
        cover: { select: { publicId: true, alt: true } },
        images: {
          select: { media: { select: { publicId: true, alt: true } } },
          orderBy: { order: "asc" },
          take: 3,
        },
        technologies: { select: technologyBadgeSelect, orderBy: { order: "asc" } },
      },
    });
  },

  listTestimonials() {
    return db.testimonial.findMany({
      where: { visible: true, freelance: true },
      orderBy: { order: "asc" },
      include: { avatar: { select: { publicId: true } } },
    });
  },

  // ── Services (admin) ─────────────────────────────────────────────────
  listServices: () => db.freelanceService.findMany({ orderBy: byOrder }),
  findService: (id: string) => db.freelanceService.findUnique({ where: { id } }),
  async maxServiceOrder() {
    const { _max } = await db.freelanceService.aggregate({ _max: { order: true } });
    return _max.order ?? -1;
  },
  createService: (data: Prisma.FreelanceServiceCreateInput) => db.freelanceService.create({ data }),
  updateService: (id: string, data: Prisma.FreelanceServiceUpdateInput) =>
    db.freelanceService.update({ where: { id }, data }),
  deleteService: (id: string) => db.freelanceService.delete({ where: { id } }),
  reorderServices: (ids: string[]) =>
    db.$transaction(
      ids.map((id, index) => db.freelanceService.update({ where: { id }, data: { order: index } })),
    ),

  // ── Offers (admin) ───────────────────────────────────────────────────
  listOffers: () => db.freelanceOffer.findMany({ orderBy: byOrder }),
  findOffer: (id: string) => db.freelanceOffer.findUnique({ where: { id } }),
  async maxOfferOrder() {
    const { _max } = await db.freelanceOffer.aggregate({ _max: { order: true } });
    return _max.order ?? -1;
  },
  createOffer: (data: Prisma.FreelanceOfferCreateInput) => db.freelanceOffer.create({ data }),
  updateOffer: (id: string, data: Prisma.FreelanceOfferUpdateInput) =>
    db.freelanceOffer.update({ where: { id }, data }),
  deleteOffer: (id: string) => db.freelanceOffer.delete({ where: { id } }),
  reorderOffers: (ids: string[]) =>
    db.$transaction(
      ids.map((id, index) => db.freelanceOffer.update({ where: { id }, data: { order: index } })),
    ),
};
