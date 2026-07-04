import path from "path";
import { promises as fs } from "fs";
import type { ReactNode } from "react";
import { compileMDX } from "next-mdx-remote/rsc";

export type BlogFrontmatter = {
    title: string,
    description: string,
    date: string,
    image?: string,
}

export type ProjectFrontmatter = {
    title: string,
    description: string,
    image?: string,
}

export type ExperienceFrontmatter = {
    companyName: string,
    description: string,
    url?: string,
    technologies?: string[],
    dateFrom: string,
    dateTo: string,
}

const dataPath = (...segments: string[]) => path.join(process.cwd(), "src/data", ...segments);

const readMdxFile = async <TFrontmatter extends object>(
    folder: string,
    slug: string,
): Promise<{ content: ReactNode; frontmatter: TFrontmatter } | null> => {
    const source = await fs.readFile(dataPath(folder, `${slug}.mdx`), "utf-8");

    if (!source) {
        return null;
    }

    const { content, frontmatter } = await compileMDX<TFrontmatter>({
        source,
        options: { parseFrontmatter: true },
    });

    return { content, frontmatter };
}

const getFrontmatterBySlug = async <TFrontmatter extends object>(folder: string, slug: string) => {
    const entry = await readMdxFile<TFrontmatter>(folder, slug);
    return entry?.frontmatter ?? null;
}

const getMdxEntries = async <TFrontmatter extends object>(folder: string): Promise<Array<{ slug: string } & TFrontmatter>> => {
    const files = await fs.readdir(dataPath(folder));
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    const entries = await Promise.all(mdxFiles.map(async (file) => {
        const slug = file.replace(".mdx", "");
        const frontmatter = await getFrontmatterBySlug<TFrontmatter>(folder, slug);
        if (!frontmatter) {
            throw new Error(`Missing frontmatter for ${folder}/${slug}.mdx`);
        }
        return { slug, ...frontmatter };
    }));

    return entries;
}

export const getSingleBlog = async (slug: string) => {
    try {
        return await readMdxFile<BlogFrontmatter>("blogs", slug);
    } catch (error) {
        console.error("Error reading blog file:", error);
        return null;
    }
}

export const getBlogs = async () => {
    return getMdxEntries<BlogFrontmatter>("blogs");
}


export const getBlogFrontmatterBySlug = async (slug: string) => {
    return getFrontmatterBySlug<BlogFrontmatter>("blogs", slug);
}

export const getSingleProject = async (slug: string) => {
    try {
        return await readMdxFile<ProjectFrontmatter>("projects", slug);
    } catch (error) {
        console.error("Error reading project file:", error);
        return null;
    }
}

export const getProjectFrontmatterBySlug = async (slug: string) => {
    return getFrontmatterBySlug<ProjectFrontmatter>("projects", slug);
}

export const getSingleExperience = async (slug: string) => {
    try {
        return await readMdxFile<ExperienceFrontmatter>("professional-experience", slug);
    } catch (error) {
        console.error("Error reading professional experience file:", error);
        return null;
    }
}

export const getExperienceFrontmatterBySlug = async (slug: string) => {
    return getFrontmatterBySlug<ExperienceFrontmatter>("professional-experience", slug);
}
