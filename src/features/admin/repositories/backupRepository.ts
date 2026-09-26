import "server-only";
import { db } from "@/shared/libs/db";

/** Every content table, for the JSON backup download. Auth tables are excluded. */
export async function exportAllContent() {
  const [
    settings,
    media,
    technologies,
    projects,
    experience,
    testimonials,
    resumes,
    tags,
    posts,
    messages,
  ] = await Promise.all([
    db.siteSettings.findMany(),
    db.mediaAsset.findMany(),
    db.technology.findMany(),
    db.project.findMany({
      include: {
        images: true,
        technologies: { select: { id: true } },
      },
    }),
    db.experience.findMany({ include: { technologies: { select: { id: true } } } }),
    db.testimonial.findMany(),
    db.resume.findMany(),
    db.tag.findMany(),
    db.post.findMany({
      include: { tags: { select: { id: true } }, _count: { select: { likes: true } } },
    }),
    db.message.findMany(),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    version: 1,
    settings,
    media,
    technologies,
    projects,
    experience,
    testimonials,
    resumes,
    tags,
    posts,
    messages,
  };
}
