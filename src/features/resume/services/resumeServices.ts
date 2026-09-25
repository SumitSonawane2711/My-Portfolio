import "server-only";
import { cldFileUrl } from "@/shared/libs/cloudinaryUrl";
import { AppError } from "@/shared/libs/errors";
import { uniqueSlug } from "@/shared/libs/slug";
import { mediaRepository } from "@/features/media/repositories/mediaRepository";
import { mediaServices } from "@/features/media/services/mediaServices";
import type { PublicResume } from "../interfaces/resume";
import { resumeRepository, type ResumeWithFile } from "../repositories/resumeRepository";
import type { ResumeInput } from "../schemas/resumeSchema";

export const toPublicResume = (row: ResumeWithFile): PublicResume => ({
  title: row.title,
  slug: row.slug,
  description: row.description,
  fileName: row.fileName,
  status: row.status,
  isPrimary: row.isPrimary,
  viewUrl: cldFileUrl(row.file.publicId, row.file.format ?? "pdf"),
  downloadPath: `/resume/${row.slug}/download`,
  updatedAt: row.updatedAt,
});

/** Where a counted download should send the browser (Cloudinary attachment URL). */
export const downloadUrl = (row: ResumeWithFile) =>
  cldFileUrl(row.file.publicId, row.file.format ?? "pdf", row.fileName);

async function assertPdf(fileId: string) {
  const file = await mediaRepository.findById(fileId);
  if (!file || file.format !== "pdf") throw new AppError("The resume file must be a PDF.");
}

// Rules (see local-docs guide, Part 13):
// - at most one primary; it is always ACTIVE
// - the first ACTIVE resume becomes primary automatically
// - archiving/deleting the primary promotes the next ACTIVE one
// - replacing the file keeps the slug, so shared links keep working
export const resumeServices = {
  async create(input: ResumeInput) {
    await assertPdf(input.fileId);
    const slug = await uniqueSlug(input.slug || input.title, (s) => resumeRepository.slugExists(s));
    const resume = await resumeRepository.create({
      title: input.title,
      slug,
      description: input.description || null,
      fileId: input.fileId,
      fileName: input.fileName,
      status: input.status,
      notes: input.notes || null,
      order: (await resumeRepository.maxOrder()) + 1,
    });
    if (input.status === "ACTIVE" && !(await resumeRepository.hasPrimary())) {
      await resumeRepository.setPrimary(resume.id);
    }
    return { slug: resume.slug };
  },

  async update(id: string, input: ResumeInput) {
    const existing = await resumeRepository.findById(id);
    if (!existing) throw new AppError("Resume not found.", "NOT_FOUND");
    if (input.fileId !== existing.fileId) await assertPdf(input.fileId);

    const slug =
      input.slug && input.slug !== existing.slug
        ? await uniqueSlug(input.slug, (s) => resumeRepository.slugExists(s, id))
        : existing.slug;
    const losesPrimary = existing.isPrimary && input.status !== "ACTIVE";

    await resumeRepository.update(id, {
      title: input.title,
      slug,
      description: input.description || null,
      fileId: input.fileId,
      fileName: input.fileName,
      status: input.status,
      notes: input.notes || null,
      ...(losesPrimary && { isPrimary: false }),
    });
    if (losesPrimary) await promoteNextPrimary(id);
    if (input.fileId !== existing.fileId) await mediaServices.releaseIfUnused(existing.fileId);

    return { oldSlug: existing.slug, slug };
  },

  async setPrimary(id: string) {
    const existing = await resumeRepository.findById(id);
    if (!existing) throw new AppError("Resume not found.", "NOT_FOUND");
    await resumeRepository.setPrimary(id);
    return { slug: existing.slug };
  },

  async setStatus(id: string, status: ResumeInput["status"]) {
    const existing = await resumeRepository.findById(id);
    if (!existing) throw new AppError("Resume not found.", "NOT_FOUND");
    const losesPrimary = existing.isPrimary && status !== "ACTIVE";
    await resumeRepository.update(id, { status, ...(losesPrimary && { isPrimary: false }) });
    if (losesPrimary) await promoteNextPrimary(id);
    if (status === "ACTIVE" && !(await resumeRepository.hasPrimary())) {
      await resumeRepository.setPrimary(id);
    }
    return { slug: existing.slug };
  },

  async delete(id: string) {
    const existing = await resumeRepository.findById(id);
    if (!existing) throw new AppError("Resume not found.", "NOT_FOUND");
    await resumeRepository.delete(id);
    if (existing.isPrimary) await promoteNextPrimary(id);
    await mediaServices.releaseIfUnused(existing.fileId);
    return { slug: existing.slug };
  },

  reorder: (ids: string[]) => resumeRepository.reorder(ids),
};

async function promoteNextPrimary(exceptId: string) {
  const next = await resumeRepository.firstActiveId(exceptId);
  if (next) await resumeRepository.setPrimary(next);
}
