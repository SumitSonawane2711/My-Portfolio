import "server-only";
import { AppError } from "@/shared/libs/errors";
import { mediaServices } from "@/features/media/services/mediaServices";
import { testimonialRepository } from "../repositories/testimonialRepository";
import type { TestimonialInput } from "../schemas/testimonialSchema";

const empty = (s: string) => (s.trim() === "" ? null : s.trim());

const fields = (input: TestimonialInput) => ({
  name: input.name,
  role: empty(input.role),
  company: empty(input.company),
  quote: input.quote,
  linkedinUrl: empty(input.linkedinUrl),
  sourceNote: empty(input.sourceNote),
  visible: input.visible,
});

export const testimonialServices = {
  async create(input: TestimonialInput) {
    return testimonialRepository.create({
      ...fields(input),
      order: (await testimonialRepository.maxOrder()) + 1,
      ...(input.avatarId && { avatar: { connect: { id: input.avatarId } } }),
    });
  },

  async update(id: string, input: TestimonialInput) {
    const existing = await testimonialRepository.findById(id);
    if (!existing) throw new AppError("Testimonial not found.", "NOT_FOUND");
    await testimonialRepository.update(id, {
      ...fields(input),
      avatar: input.avatarId ? { connect: { id: input.avatarId } } : { disconnect: true },
    });
    if (existing.avatarId !== input.avatarId) {
      await mediaServices.releaseIfUnused(existing.avatarId);
    }
  },

  async toggleVisibility(id: string) {
    const existing = await testimonialRepository.findById(id);
    if (!existing) throw new AppError("Testimonial not found.", "NOT_FOUND");
    await testimonialRepository.update(id, { visible: !existing.visible });
  },

  async delete(id: string) {
    const existing = await testimonialRepository.findById(id);
    if (!existing) throw new AppError("Testimonial not found.", "NOT_FOUND");
    await testimonialRepository.delete(id);
    await mediaServices.releaseIfUnused(existing.avatarId);
  },

  reorder: (ids: string[]) => testimonialRepository.reorder(ids),
};
