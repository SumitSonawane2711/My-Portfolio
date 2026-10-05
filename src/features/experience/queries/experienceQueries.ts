import "server-only";
import type { JSONContent } from "@tiptap/react";
import { CACHE_TAGS, cachedQuery } from "@/shared/libs/dataCache";
import { formatDateRange, yearsSince } from "@/shared/libs/format";
import type { ExperienceAdminRow, ExperienceFormData } from "../interfaces/experience";
import { experienceRepository } from "../repositories/experienceRepository";
import { dateToMonth } from "../schemas/experienceSchema";
import { toExperienceCard, toExperienceDetail } from "../services/experienceServices";

// Public (data cache, cleared on save via revalidateSite). Cards list
// technology names, so technology edits clear them too.
const EXPERIENCE_TAGS = [CACHE_TAGS.experience, CACHE_TAGS.technologies];

export const getExperiences = cachedQuery("experience:all", EXPERIENCE_TAGS, async () =>
  (await experienceRepository.listPublished()).map(toExperienceCard),
);

export const getExperience = cachedQuery(
  "experience:one",
  EXPERIENCE_TAGS,
  async (slug: string) => {
    const row = await experienceRepository.findPublishedBySlug(slug);
    return row ? toExperienceDetail(row) : null;
  },
);

/** Slugs of entries that have a write-up (only those get a detail page). */
export const getExperienceSlugs = cachedQuery("experience:slugs", EXPERIENCE_TAGS, async () =>
  (await experienceRepository.listPublished())
    .filter((row) => row.contentHtml.trim())
    .map(({ slug, updatedAt }) => ({ slug, updatedAt })),
);

/** Whole years since the first role started — replaces the hard-coded "2+". */
export const getYearsOfExperience = cachedQuery(
  "experience:years",
  [CACHE_TAGS.experience],
  async () => {
    const first = await experienceRepository.earliestStartDate();
    return first ? yearsSince(first) : 0;
  },
);

export async function getExperiencesForAdmin(): Promise<ExperienceAdminRow[]> {
  const rows = await experienceRepository.listForAdmin();
  return rows.map((row) => ({
    id: row.id,
    company: row.company,
    role: row.role,
    period: formatDateRange(row.startDate, row.endDate),
    published: row.published,
  }));
}

export async function getExperienceForEdit(id: string): Promise<ExperienceFormData | null> {
  const row = await experienceRepository.findForEdit(id);
  if (!row) return null;
  return {
    id: row.id,
    company: row.company,
    slug: row.slug,
    role: row.role,
    companyUrl: row.companyUrl ?? "",
    location: row.location ?? "",
    startMonth: dateToMonth(row.startDate),
    endMonth: row.endDate ? dateToMonth(row.endDate) : "",
    summary: row.summary,
    contentJson: (row.contentJson as JSONContent | null) ?? null,
    contentHtml: row.contentHtml,
    published: row.published,
    technologyIds: row.technologies.map((t) => t.id),
  };
}
