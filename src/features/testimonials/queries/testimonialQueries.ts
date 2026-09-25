import "server-only";
import { cache } from "react";
import type { TestimonialAdminRow, TestimonialCard } from "../interfaces/testimonial";
import { testimonialRepository } from "../repositories/testimonialRepository";

export const getVisibleTestimonials = cache(async (): Promise<TestimonialCard[]> => {
  const rows = await testimonialRepository.listVisible();
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    byline: [row.role, row.company].filter(Boolean).join(", ") || null,
    quote: row.quote,
    avatarPublicId: row.avatar?.publicId ?? null,
    linkedinUrl: row.linkedinUrl,
  }));
});

export async function getTestimonialsForAdmin(): Promise<TestimonialAdminRow[]> {
  const rows = await testimonialRepository.list();
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    role: row.role ?? "",
    company: row.company ?? "",
    quote: row.quote,
    linkedinUrl: row.linkedinUrl ?? "",
    sourceNote: row.sourceNote ?? "",
    visible: row.visible,
    avatar: row.avatar,
  }));
}
