import { getFrontmatterBySlug, readMdxFile } from "@/shared/libs/mdx";
import { projects } from "../constants/projects";
import type { Project, ProjectFrontmatter } from "../interfaces/project";

const FOLDER = "projects";

export const getProjectBySlug = (slug: string) => {
  return projects.find((project: Project) => project.slug === slug);
};

export const getSingleProject = async (slug: string) => {
  try {
    return await readMdxFile<ProjectFrontmatter>(FOLDER, slug);
  } catch (error) {
    console.error("Error reading project file:", error);
    return null;
  }
};

export const getProjectFrontmatterBySlug = async (slug: string) => {
  return getFrontmatterBySlug<ProjectFrontmatter>(FOLDER, slug);
};
