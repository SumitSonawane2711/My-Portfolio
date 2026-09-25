import { db, log, registerLocalFile, type ImportContext } from "./shared";

// The single resume that was in /public (moved to /files/resumes so the old
// URL can redirect to /resume/download). Becomes the primary ACTIVE resume.
const RESUME = {
  title: "Full-stack Developer",
  slug: "full-stack",
  fileName: "CV_Sumit_Sonawane_2026.pdf",
  path: "/files/resumes/CV_Sumit_Sonawane_2026.pdf",
};

export async function importResumes(ctx: ImportContext) {
  const label = `resume ${RESUME.slug}`;
  try {
    const fileId = await registerLocalFile(ctx, RESUME.path);
    const existing = await db.resume.findUnique({ where: { slug: RESUME.slug } });
    if (!ctx.dryRun) {
      const hasPrimary = (await db.resume.count({ where: { isPrimary: true } })) > 0;
      await db.resume.upsert({
        where: { slug: RESUME.slug },
        create: {
          title: RESUME.title,
          slug: RESUME.slug,
          fileName: RESUME.fileName,
          fileId,
          status: "ACTIVE",
          isPrimary: !hasPrimary,
        },
        update: { fileId, fileName: RESUME.fileName },
      });
    }
    if (existing) log.updated(label);
    else log.created(label);
  } catch (error) {
    log.error(label, error);
  }
}
