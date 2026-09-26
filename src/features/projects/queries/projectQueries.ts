import "server-only";
import { cache } from "react";
import type { JSONContent } from "@tiptap/react";
import type { ProjectAdminRow, ProjectFormData } from "../interfaces/project";
import { projectRepository } from "../repositories/projectRepository";
import { toProjectCard, toProjectDetail } from "../services/projectServices";

// ── Public (cached per request; pages are static + revalidated on save) ──

export const getHomeProjects = cache(async (take = 3) =>
  (await projectRepository.listForHome(take)).map(toProjectCard),
);

export const getAllProjects = cache(async () =>
  (await projectRepository.listPublished()).map(toProjectCard),
);

export const getProject = cache(async (slug: string) => {
  const row = await projectRepository.findPublishedBySlug(slug);
  return row ? toProjectDetail(row) : null;
});

export const getProjectSlugs = cache(() => projectRepository.listPublishedSlugs());

// ── Admin ────────────────────────────────────────────────────────────────

export async function getProjectsForAdmin(): Promise<ProjectAdminRow[]> {
  const rows = await projectRepository.listForAdmin();
  return rows.map(({ cover, ...row }) => ({ ...row, coverPublicId: cover?.publicId ?? null }));
}

export async function getProjectForEdit(id: string): Promise<ProjectFormData | null> {
  const row = await projectRepository.findForEdit(id);
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    subtitle: row.subtitle ?? "",
    summary: row.summary,
    displayDate: row.displayDate ?? "",
    cover: row.cover,
    images: row.images.map((i) => i.media),
    contentJson: (row.contentJson as JSONContent | null) ?? null,
    contentHtml: row.contentHtml,
    liveUrl: row.liveUrl ?? "",
    repoUrl: row.repoUrl ?? "",
    featured: row.featured,
    published: row.published,
    technologyIds: row.technologies.map((t) => t.id),
    seoTitle: row.seoTitle ?? "",
    seoDescription: row.seoDescription ?? "",
  };
}
