import path from "path";
import { promises as fs } from "fs";
import type { ReactNode } from "react";
import { compileMDX } from "next-mdx-remote/rsc";

// Server-only (uses `fs`) — generic MDX reader for the content under
// `src/data/<folder>/<slug>.mdx`. Feature services (blog, projects,
// experience) wrap these with their own frontmatter types.

const dataPath = (...segments: string[]) => path.join(process.cwd(), "src/data", ...segments);

export const readMdxFile = async <TFrontmatter extends object>(
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
};

export const getFrontmatterBySlug = async <TFrontmatter extends object>(
  folder: string,
  slug: string,
) => {
  try {
    const entry = await readMdxFile<TFrontmatter>(folder, slug);
    return entry?.frontmatter ?? null;
  } catch {
    // Unknown slug (no such .mdx file) — callers treat null as "not found".
    return null;
  }
};

export const getMdxEntries = async <TFrontmatter extends object>(
  folder: string,
): Promise<Array<{ slug: string } & TFrontmatter>> => {
  const files = await fs.readdir(dataPath(folder));
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  const entries = await Promise.all(
    mdxFiles.map(async (file) => {
      const slug = file.replace(".mdx", "");
      const frontmatter = await getFrontmatterBySlug<TFrontmatter>(folder, slug);
      if (!frontmatter) {
        throw new Error(`Missing frontmatter for ${folder}/${slug}.mdx`);
      }
      return { slug, ...frontmatter };
    }),
  );

  return entries;
};
