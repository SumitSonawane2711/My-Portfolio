import { getFrontmatterBySlug, readMdxFile } from "@/shared/libs/mdx";
import { professionalExperience } from "../constants/professional-experience";
import type { ExperienceFrontmatter } from "../interfaces/experience";

const FOLDER = "professional-experience";

export const getExperienceBySlug = (slug: string) => {
  return professionalExperience.find((item) => item.slug === slug);
};

export const getSingleExperience = async (slug: string) => {
  try {
    return await readMdxFile<ExperienceFrontmatter>(FOLDER, slug);
  } catch (error) {
    console.error("Error reading professional experience file:", error);
    return null;
  }
};

export const getExperienceFrontmatterBySlug = async (slug: string) => {
  return getFrontmatterBySlug<ExperienceFrontmatter>(FOLDER, slug);
};
