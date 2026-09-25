import "server-only";
import { cache } from "react";
import type { ResumeAdminRow } from "../interfaces/resume";
import { resumeRepository } from "../repositories/resumeRepository";
import { toPublicResume } from "../services/resumeServices";

export const getActiveResumes = cache(async () =>
  (await resumeRepository.listActive()).map(toPublicResume),
);

export const getDefaultResume = cache(async () => {
  const row = await resumeRepository.findDefault();
  return row ? toPublicResume(row) : null;
});

export const getPublicResume = cache(async (slug: string) => {
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
