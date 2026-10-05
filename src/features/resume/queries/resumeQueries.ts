import "server-only";
import { CACHE_TAGS, cachedQuery } from "@/shared/libs/dataCache";
import type { ResumeAdminRow } from "../interfaces/resume";
import { resumeRepository } from "../repositories/resumeRepository";
import { toPublicResume } from "../services/resumeServices";

const RESUME_TAGS = [CACHE_TAGS.resumes];

export const getActiveResumes = cachedQuery("resumes:active", RESUME_TAGS, async () =>
  (await resumeRepository.listActive()).map(toPublicResume),
);

export const getDefaultResume = cachedQuery("resumes:default", RESUME_TAGS, async () => {
  const row = await resumeRepository.findDefault();
  return row ? toPublicResume(row) : null;
});

export const getPublicResume = cachedQuery("resumes:one", RESUME_TAGS, async (slug: string) => {
  const row = await resumeRepository.findPublicBySlug(slug);
  return row ? toPublicResume(row) : null;
});

export async function getResumesForAdmin(): Promise<ResumeAdminRow[]> {
  const rows = await resumeRepository.list();
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? "",
    fileName: row.fileName,
    status: row.status,
    isPrimary: row.isPrimary,
    downloadCount: row.downloadCount,
    notes: row.notes ?? "",
    file: row.file,
    updatedAt: row.updatedAt,
  }));
}
