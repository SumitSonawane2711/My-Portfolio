import type { MetadataRoute } from "next";
import { clientEnv } from "@/shared/configs/clientEnv";
import { getExperienceSlugs } from "@/features/experience/queries/experienceQueries";
import { getProjectSlugs } from "@/features/projects/queries/projectQueries";
import { getActiveResumes } from "@/features/resume/queries/resumeQueries";

export const revalidate = 3600;

// Unlisted resumes, drafts and archived items are deliberately left out.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = clientEnv.siteUrl;
  const [projects, experience, resumes] = await Promise.all([
    getProjectSlugs(),
    getExperienceSlugs(),
    getActiveResumes(),
  ]);

  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/resume`, changeFrequency: "monthly", priority: 0.6 },
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: p.updatedAt })),
    ...experience.map((e) => ({
      url: `${base}/professional-experience/${e.slug}`,
      lastModified: e.updatedAt,
    })),
    ...resumes.map((r) => ({ url: `${base}/resume/${r.slug}`, lastModified: r.updatedAt })),
  ];
}
