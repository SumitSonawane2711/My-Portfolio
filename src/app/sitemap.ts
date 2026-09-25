import type { MetadataRoute } from "next";
import { clientEnv } from "@/shared/configs/clientEnv";
import { getPostSlugs, getTags } from "@/features/blog/queries/blogQueries";
import { getExperienceSlugs } from "@/features/experience/queries/experienceQueries";
import { getProjectSlugs } from "@/features/projects/queries/projectQueries";
import { getActiveResumes } from "@/features/resume/queries/resumeQueries";

export const revalidate = 3600;

// Unlisted resumes, drafts and archived items are deliberately left out.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = clientEnv.siteUrl;
  const [projects, posts, tags, experience, resumes] = await Promise.all([
    getProjectSlugs(),
    getPostSlugs(),
    getTags(),
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
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.updatedAt })),
    ...tags.map((t) => ({ url: `${base}/blog/tag/${t.slug}` })),
    ...experience.map((e) => ({
      url: `${base}/professional-experience/${e.slug}`,
      lastModified: e.updatedAt,
    })),
    ...resumes.map((r) => ({ url: `${base}/resume/${r.slug}`, lastModified: r.updatedAt })),
  ];
}
