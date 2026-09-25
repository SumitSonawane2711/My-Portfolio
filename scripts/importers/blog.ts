import { readdir } from "node:fs/promises";
import path from "node:path";
import type { Prisma } from "@/generated/prisma/client";
import { slugify } from "@/shared/libs/slug";
import { excerptFrom } from "@/features/blog/services/publishRules";
import {
  db,
  log,
  readMarkdown,
  registerLocalFile,
  skipExisting,
  type ImportContext,
} from "./shared";

const BLOG_DIR = path.join(process.cwd(), "scripts/legacy-content/blogs");

type Frontmatter = {
  title?: string;
  description?: string;
  image?: string;
  date?: string;
  tags?: string[];
  draft?: boolean;
};

/** "2026-01-15" or "July 2026" → a UTC date. */
function parseDate(value: string | undefined) {
  if (!value) return null;
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00Z`) : null;
  const date = iso ?? new Date(`1 ${value} UTC`);
  if (Number.isNaN(date.getTime())) throw new Error(`Can't parse date "${value}"`);
  return date;
}

export async function importBlog(ctx: ImportContext) {
  for (const file of await readdir(BLOG_DIR)) {
    if (!/\.mdx?$/.test(file)) continue;
    // File names become slugs (so URLs stay the same); "Adopting-AI-Agents..mdx"
    // is cleaned to "adopting-ai-agents" and redirected in next.config.ts.
    const slug = slugify(file.replace(/\.mdx?$/, ""));
    const label = `post ${slug}`;
    try {
      const content = await readMarkdown<Frontmatter>(path.join(BLOG_DIR, file));
      const { data } = content;
      const coverId = data.image ? await registerLocalFile(ctx, data.image, data.title) : null;
      const tags = (data.tags ?? []).map((name) => ({ name, slug: slugify(name) }));

      const fields = {
        title: data.title ?? slug,
        excerpt: data.description ?? excerptFrom(content.plainText),
        contentHtml: content.html,
        // Null JSON: the editor loads the HTML the first time the post is opened.
        toc: content.toc as Prisma.InputJsonValue,
        readingMinutes: content.readingMinutes,
        status: data.draft ? ("DRAFT" as const) : ("PUBLISHED" as const),
        publishedAt: parseDate(data.date),
        ...(coverId && !ctx.dryRun ? { cover: { connect: { id: coverId } } } : {}),
        tags: {
          connectOrCreate: tags.map((tag) => ({ where: { slug: tag.slug }, create: tag })),
        },
      };

      const existing = await db.post.findUnique({ where: { slug } });
      if (skipExisting(ctx, Boolean(existing), label)) continue;
      if (!ctx.dryRun) {
        await db.post.upsert({
          where: { slug },
          create: { ...fields, slug },
          update: { ...fields, tags: { set: [], ...fields.tags } },
        });
      }
      if (existing) log.updated(label);
      else log.created(label);
    } catch (error) {
      log.error(label, error);
    }
  }
}
