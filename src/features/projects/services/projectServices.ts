import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { processContent, type TocItem } from "@/shared/libs/content/process";
import { AppError } from "@/shared/libs/errors";
import { uniqueSlug } from "@/shared/libs/slug";
import { mediaServices } from "@/features/media/services/mediaServices";
import { toTechBadge } from "@/features/technologies/services/technologyServices";
import type { ProjectCard, ProjectDetail } from "../interfaces/project";
import {
  projectRepository,
  type ProjectCardRow,
  type ProjectDetailRow,
} from "../repositories/projectRepository";
import type { ProjectInput } from "../schemas/projectSchema";

// ── Mappers (rows → view models) ─────────────────────────────────────────

export const toProjectCard = (row: ProjectCardRow): ProjectCard => ({
  title: row.title,
  slug: row.slug,
  summary: row.summary,
  displayDate: row.displayDate,
  coverPublicId: row.cover?.publicId ?? null,
  coverAlt: row.cover?.alt ?? null,
  technologies: row.technologies.map(toTechBadge),
});

export const toProjectDetail = (row: ProjectDetailRow): ProjectDetail => {
  const card = toProjectCard(row);
  const images = row.images.map((i) => i.media.publicId);
  return {
    ...card,
    subtitle: row.subtitle,
    images: images.length ? images : card.coverPublicId ? [card.coverPublicId] : [],
    contentHtml: row.contentHtml,
    toc: (row.toc as TocItem[]) ?? [],
    liveUrl: row.liveUrl,
    repoUrl: row.repoUrl,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
  };
};

// ── Business rules ───────────────────────────────────────────────────────

const empty = (s: string) => (s.trim() === "" ? null : s.trim());

async function contentFields(input: ProjectInput) {
  const processed = await processContent(input.contentHtml);
  return {
    contentJson: (input.contentJson ?? undefined) as Prisma.InputJsonValue | undefined,
    contentHtml: processed.html,
    toc: processed.toc as unknown as Prisma.InputJsonValue,
  };
}

const scalarFields = (input: ProjectInput) => ({
  title: input.title,
  subtitle: empty(input.subtitle),
  summary: input.summary,
  displayDate: empty(input.displayDate),
  liveUrl: empty(input.liveUrl),
  repoUrl: empty(input.repoUrl),
  featured: input.featured,
  published: input.published,
  portfolio: input.portfolio,
  freelance: input.freelance,
  clientName: empty(input.clientName),
  outcome: empty(input.outcome),
  seoTitle: empty(input.seoTitle),
  seoDescription: empty(input.seoDescription),
});

/** The freelance page shows a carousel of at most this many projects. */
export const MAX_FREELANCE_PROJECTS = 3;

async function assertFreelanceRoom(input: ProjectInput, projectId?: string) {
  if (!input.freelance) return;
  if ((await projectRepository.countFreelance(projectId)) >= MAX_FREELANCE_PROJECTS) {
    throw new AppError(
      `The freelance page shows at most ${MAX_FREELANCE_PROJECTS} projects. Turn "Freelance page" off on another project first.`,
    );
  }
}

export const projectServices = {
  async create(input: ProjectInput) {
    await assertFreelanceRoom(input);
    const slug = await uniqueSlug(input.slug || input.title, (s) =>
      projectRepository.slugExists(s),
    );
    return projectRepository.create({
      ...scalarFields(input),
      ...(await contentFields(input)),
      slug,
      order: (await projectRepository.maxOrder()) + 1,
      ...(input.coverId && { cover: { connect: { id: input.coverId } } }),
      ...(input.previewVideoId && { previewVideo: { connect: { id: input.previewVideoId } } }),
      images: { create: input.imageIds.map((mediaId, order) => ({ mediaId, order })) },
      technologies: { connect: input.technologyIds.map((id) => ({ id })) },
    });
  },

  /** Returns the old and new slug so callers can revalidate both pages. */
  async update(id: string, input: ProjectInput) {
    const existing = await projectRepository.findById(id);
    if (!existing) throw new AppError("Project not found.", "NOT_FOUND");
    await assertFreelanceRoom(input, id);

    // The slug only changes when edited explicitly, so shared links keep working.
    const slug =
      input.slug && input.slug !== existing.slug
        ? await uniqueSlug(input.slug, (s) => projectRepository.slugExists(s, id))
        : existing.slug;

    const updated = await projectRepository.update(
      id,
      {
        ...scalarFields(input),
        ...(await contentFields(input)),
        slug,
        cover: input.coverId ? { connect: { id: input.coverId } } : { disconnect: true },
        previewVideo: input.previewVideoId
          ? { connect: { id: input.previewVideoId } }
          : { disconnect: true },
        technologies: { set: input.technologyIds.map((tid) => ({ id: tid })) },
      },
      input.imageIds,
    );

    // Release files this project no longer uses (only deleted if nothing else uses them).
    const kept = new Set([input.coverId, input.previewVideoId, ...input.imageIds]);
    await mediaServices.releaseManyIfUnused(
      [existing.coverId, existing.previewVideoId, ...existing.images.map((i) => i.mediaId)].filter(
        (m) => !kept.has(m),
      ),
    );

    return { oldSlug: existing.slug, slug: updated.slug };
  },

  async delete(id: string) {
    const existing = await projectRepository.findById(id);
    if (!existing) throw new AppError("Project not found.", "NOT_FOUND");
    await projectRepository.delete(id);
    await mediaServices.releaseManyIfUnused([
      existing.coverId,
      existing.previewVideoId,
      ...existing.images.map((i) => i.mediaId),
    ]);
    return { slug: existing.slug };
  },

  reorder: (ids: string[]) => projectRepository.reorder(ids),
};
