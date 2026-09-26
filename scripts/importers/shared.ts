// Shared helpers for the content importers. Runs under tsx, outside Next.js:
// import only `db` and `shared/libs/content/*` from the app — never
// repositories/services/actions or configs/env.ts (they are `server-only`).
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import matter from "gray-matter";
import { marked } from "marked";
import { db } from "@/shared/libs/db";
import { processContent } from "@/shared/libs/content/process";

export { db };

export type ImportContext = {
  dryRun: boolean;
  /** Replace rows that already exist (default: keep them — they may have been edited in the dashboard). */
  overwrite: boolean;
};

/** True (and logged) when an existing row must be kept because --overwrite was not given. */
export function skipExisting(ctx: ImportContext, existed: boolean, label: string) {
  if (!existed || ctx.overwrite) return false;
  log.skipped(label, "already exists — use --overwrite to replace it");
  return true;
}

type Summary = { created: number; updated: number; skipped: number; errors: number };

export const summary: Summary = { created: 0, updated: 0, skipped: 0, errors: 0 };

export const log = {
  created: (what: string) => {
    summary.created++;
    console.log(`  ✔ created  ${what}`);
  },
  updated: (what: string) => {
    summary.updated++;
    console.log(`  ↻ updated  ${what}`);
  },
  skipped: (what: string, why: string) => {
    summary.skipped++;
    console.log(`  – skipped  ${what} (${why})`);
  },
  error: (what: string, error: unknown) => {
    summary.errors++;
    console.log(`  ✖ error    ${what}: ${error instanceof Error ? error.message : String(error)}`);
  },
  info: (message: string) => console.log(`  · ${message}`),
};

// Upserts by a unique key and reports created/updated. In dry-run mode it
// only reports what would happen.
export async function reportUpsert(
  ctx: ImportContext,
  label: string,
  exists: () => Promise<boolean>,
  write: () => Promise<unknown>,
) {
  try {
    const existed = await exists();
    if (skipExisting(ctx, existed, label)) return;
    if (!ctx.dryRun) await write();
    if (existed) log.updated(label);
    else log.created(label);
  } catch (error) {
    log.error(label, error);
  }
}

// ── Media ────────────────────────────────────────────────────────────────

export const PUBLIC_DIR = path.join(process.cwd(), "public");

const DRY_RUN_ID = "dry-run";
const mediaCache = new Map<string, string>();

/**
 * Records a file from /public (e.g. "/projects/edms/ss1.png") as a MediaAsset
 * with resourceType "local": the site keeps serving it from /public exactly as
 * before. `upload-local-media` later moves these to Cloudinary in place.
 * Returns the MediaAsset id.
 */
export async function registerLocalFile(ctx: ImportContext, sitePath: string, alt?: string) {
  const cached = mediaCache.get(sitePath);
  if (cached) return cached;

  const file = path.join(PUBLIC_DIR, sitePath);
  const { size } = await stat(file); // throws if the file is missing
  const format = path.extname(file).slice(1).toLowerCase();
  let width: number | null = null;
  let height: number | null = null;
  if (format !== "pdf" && format !== "svg") {
    const meta = await sharp(file).metadata();
    width = meta.width ?? null;
    height = meta.height ?? null;
  }

  if (ctx.dryRun) return DRY_RUN_ID;

  // Already uploaded to Cloudinary by an earlier run? Reuse that asset.
  const uploaded = await db.mediaAsset.findFirst({
    where: { publicId: { endsWith: slugForMedia(sitePath) }, resourceType: { not: "local" } },
    select: { id: true },
  });
  const asset =
    uploaded ??
    (await db.mediaAsset.upsert({
      where: { publicId: sitePath },
      create: {
        publicId: sitePath,
        resourceType: "local",
        format,
        width,
        height,
        bytes: size,
        alt: alt ?? null,
      },
      update: { format, width, height, bytes: size, ...(alt && { alt }) },
      select: { id: true },
    }));

  mediaCache.set(sitePath, asset.id);
  return asset.id;
}

/** "/projects/edms/ss1.png" → "projects-edms-ss1" (stable Cloudinary name). */
export const slugForMedia = (sitePath: string) =>
  sitePath
    .replace(/^\//, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase();

// ── Markdown / MDX ───────────────────────────────────────────────────────

export type MarkdownFile<T> = {
  data: T;
  html: string;
  toc: unknown;
  readingMinutes: number;
  plainText: string;
};

/**
 * Reads a Markdown/MDX file, converts it with `marked` and runs the same
 * processContent() pipeline the editor uses. Throws on MDX-only syntax
 * (import/export lines or JSX components), which Markdown can't represent.
 */
export async function readMarkdown<T = Record<string, unknown>>(
  file: string,
): Promise<MarkdownFile<T>> {
  const source = await readFile(file, "utf8");
  const { data, content } = matter(source);
  // Code samples inside ``` fences are plain text, not MDX syntax.
  const prose = content.replace(/^(```|~~~)[\s\S]*?^\1/gm, "");
  if (/^(import|export)\s/m.test(prose) || /<[A-Z][A-Za-z]*[\s/>]/.test(prose)) {
    throw new Error("contains MDX-only syntax (import/export or JSX) — convert it by hand");
  }
  const rawHtml = await marked.parse(content);
  const processed = await processContent(rawHtml);
  return { data: data as T, ...processed };
}
