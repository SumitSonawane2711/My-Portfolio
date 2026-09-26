import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { processContent } from "@/shared/libs/content/process";
import { AppError } from "@/shared/libs/errors";
import { formatDateRange } from "@/shared/libs/format";
import { uniqueSlug } from "@/shared/libs/slug";
import { mediaServices } from "@/features/media/services/mediaServices";
import type { ExperienceCard, ExperienceDetail } from "../interfaces/experience";
import { experienceRepository, type ExperienceRow } from "../repositories/experienceRepository";
import { monthToDate, type ExperienceInput } from "../schemas/experienceSchema";

export const toExperienceCard = (row: ExperienceRow): ExperienceCard => ({
  company: row.company,
  slug: row.slug,
  role: row.role,
  companyUrl: row.companyUrl,
  period: formatDateRange(row.startDate, row.endDate),
  summary: row.summary,
  technologies: row.technologies.map((t) => t.name),
  hasDetails: row.contentHtml.trim().length > 0,
});

export const toExperienceDetail = (row: ExperienceRow): ExperienceDetail => ({
  ...toExperienceCard(row),
  location: row.location,
  contentHtml: row.contentHtml,
});

const empty = (s: string) => (s.trim() === "" ? null : s.trim());

async function fields(input: ExperienceInput) {
  const processed = await processContent(input.contentHtml);
  return {
    company: input.company,
    role: input.role,
    companyUrl: empty(input.companyUrl),
    location: empty(input.location),
    startDate: monthToDate(input.startMonth),
    endDate: input.endMonth ? monthToDate(input.endMonth) : null,
    summary: input.summary,
    published: input.published,
    contentJson: (input.contentJson ?? undefined) as Prisma.InputJsonValue | undefined,
    contentHtml: processed.html,
  };
}

export const experienceServices = {
  async create(input: ExperienceInput) {
    const slug = await uniqueSlug(input.slug || input.company, (s) =>
      experienceRepository.slugExists(s),
    );
    return experienceRepository.create({
      ...(await fields(input)),
      slug,
      technologies: { connect: input.technologyIds.map((id) => ({ id })) },
    });
  },

  async update(id: string, input: ExperienceInput) {
    const existing = await experienceRepository.findById(id);
    if (!existing) throw new AppError("Experience not found.", "NOT_FOUND");
    const slug =
      input.slug && input.slug !== existing.slug
        ? await uniqueSlug(input.slug, (s) => experienceRepository.slugExists(s, id))
        : existing.slug;

    const updated = await experienceRepository.update(id, {
      ...(await fields(input)),
      slug,
      technologies: { set: input.technologyIds.map((tid) => ({ id: tid })) },
    });
    return { oldSlug: existing.slug, slug: updated.slug };
  },

  async delete(id: string) {
    const existing = await experienceRepository.findById(id);
    if (!existing) throw new AppError("Experience not found.", "NOT_FOUND");
    await experienceRepository.delete(id);
    await mediaServices.releaseIfUnused(existing.logoId);
    return { slug: existing.slug };
  },
};
