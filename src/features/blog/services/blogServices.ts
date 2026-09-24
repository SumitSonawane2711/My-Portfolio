import { getFrontmatterBySlug, getMdxEntries, readMdxFile } from "@/shared/libs/mdx";
import type { BlogFrontmatter } from "../interfaces/blog";

const FOLDER = "blogs";

export const getSingleBlog = async (slug: string) => {
  try {
    return await readMdxFile<BlogFrontmatter>(FOLDER, slug);
  } catch (error) {
    console.error("Error reading blog file:", error);
    return null;
  }
};

export const getBlogs = async () => {
  return getMdxEntries<BlogFrontmatter>(FOLDER);
};

// Newest first — shared by the /blog listing and the home page preview.
export const getSortedBlogs = async () => {
  return (await getBlogs()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getBlogFrontmatterBySlug = async (slug: string) => {
  return getFrontmatterBySlug<BlogFrontmatter>(FOLDER, slug);
};
