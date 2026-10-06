import "server-only";
import { AppError } from "@/shared/libs/errors";
import { mediaServices } from "@/features/media/services/mediaServices";
import { toTechBadge } from "@/features/technologies/services/technologyServices";
import type { FreelanceWorkItem } from "../interfaces/freelance";
import { freelanceRepository } from "../repositories/freelanceRepository";
import type {
  FreelanceOfferInput,
  FreelanceServiceInput,
  FreelanceSettingsData,
} from "../schemas/freelanceSchema";

type WorkRow = Awaited<ReturnType<typeof freelanceRepository.listWork>>[number];

// Captions are one line; without an outcome, the summary's first sentence is used.
const firstSentence = (text: string) => text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;

/** Cover first, then gallery images, without repeats, at most three. */
export function toWorkItem(row: WorkRow): FreelanceWorkItem {
  const images = [
    ...(row.cover ? [row.cover] : []),
    ...row.images.map((image) => image.media),
  ].filter((image, index, all) => all.findIndex((i) => i.publicId === image.publicId) === index);

  return {
    slug: row.slug,
    title: row.title,
    clientName: row.clientName,
    outcome: row.outcome?.trim() || firstSentence(row.summary),
    displayDate: row.displayDate,
    images: images.slice(0, 3),
    videoPublicId: row.previewVideo?.publicId ?? null,
    liveUrl: row.liveUrl,
    technologies: row.technologies.map(toTechBadge),
  };
}

const offerFields = (input: FreelanceOfferInput) => ({
  name: input.name,
  badge: input.badge || null,
  tagline: input.tagline,
  description: input.description,
  deliverables: input.deliverables,
  visible: input.visible,
});

export const freelanceServices = {
  async updateSettings({ portraitId, ogImageId, whatsapp, ...copy }: FreelanceSettingsData) {
    const before = await freelanceRepository.getSettings();
    await freelanceRepository.updateSettings({
      ...copy,
      whatsapp: whatsapp || null,
      portrait: portraitId ? { connect: { id: portraitId } } : { disconnect: true },
      ogImage: ogImageId ? { connect: { id: ogImageId } } : { disconnect: true },
    });
    await mediaServices.releaseManyIfUnused(
      [before.portraitId, before.ogImageId].filter((id) => id !== portraitId && id !== ogImageId),
    );
  },

  // ── Services ─────────────────────────────────────────────────────────
  async createService(input: FreelanceServiceInput) {
    return freelanceRepository.createService({
      ...input,
      order: (await freelanceRepository.maxServiceOrder()) + 1,
    });
  },

  async updateService(id: string, input: FreelanceServiceInput) {
    if (!(await freelanceRepository.findService(id))) {
      throw new AppError("Service not found.", "NOT_FOUND");
    }
    await freelanceRepository.updateService(id, input);
  },

  async deleteService(id: string) {
    if (!(await freelanceRepository.findService(id))) {
      throw new AppError("Service not found.", "NOT_FOUND");
    }
    await freelanceRepository.deleteService(id);
  },

  reorderServices: (ids: string[]) => freelanceRepository.reorderServices(ids),

  // ── Offers ───────────────────────────────────────────────────────────
  async createOffer(input: FreelanceOfferInput) {
    return freelanceRepository.createOffer({
      ...offerFields(input),
      order: (await freelanceRepository.maxOfferOrder()) + 1,
    });
  },

  async updateOffer(id: string, input: FreelanceOfferInput) {
    if (!(await freelanceRepository.findOffer(id))) {
      throw new AppError("Offer not found.", "NOT_FOUND");
    }
    await freelanceRepository.updateOffer(id, offerFields(input));
  },

  async deleteOffer(id: string) {
    if (!(await freelanceRepository.findOffer(id))) {
      throw new AppError("Offer not found.", "NOT_FOUND");
    }
    await freelanceRepository.deleteOffer(id);
  },

  reorderOffers: (ids: string[]) => freelanceRepository.reorderOffers(ids),

  async setVisible(kind: "service" | "offer", id: string, visible: boolean) {
    const exists =
      kind === "service"
        ? await freelanceRepository.findService(id)
        : await freelanceRepository.findOffer(id);
    if (!exists) throw new AppError("Item not found.", "NOT_FOUND");
    if (kind === "service") await freelanceRepository.updateService(id, { visible });
    else await freelanceRepository.updateOffer(id, { visible });
  },
};
