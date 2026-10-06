import "server-only";
import type { JSONContent } from "@tiptap/react";
import { CACHE_TAGS, cachedQuery } from "@/shared/libs/dataCache";
import type { ProjectAdminRow, ProjectFormData } from "../interfaces/project";
import { projectRepository } from "../repositories/projectRepository";
import { toProjectCard, toProjectDetail } from "../services/projectServices";

// ── Public (data cache, cleared on save via revalidateSite) ──────────────
// Project cards show technology icons, so technology edits clear them too.
const PROJECT_TAGS = [CACHE_TAGS.projects, CACHE_TAGS.technologies];

export const getHomeProjects = cachedQuery("projects:home", PROJECT_TAGS, async (take: number) =>
  (await projectRepository.listForHome(take)).map(toProjectCard),
);

export const getAllProjects = cachedQuery("projects:all", PROJECT_TAGS, async () =>
  (await projectRepository.listPublished()).map(toProjectCard),
);

export const getProject = cachedQuery("projects:one", PROJECT_TAGS, async (slug: string) => {
  const row = await projectRepository.findPublishedBySlug(slug);
  return row ? toProjectDetail(row) : null;
});

export const getProjectSlugs = cachedQuery("projects:slugs", PROJECT_TAGS, () =>
  projectRepository.listPublishedSlugs(),
);

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
    freelance: row.freelance,
    clientName: row.clientName ?? "",
    outcome: row.outcome ?? "",
    technologyIds: row.technologies.map((t) => t.id),
    seoTitle: row.seoTitle ?? "",
    seoDescription: row.seoDescription ?? "",
  };
}
