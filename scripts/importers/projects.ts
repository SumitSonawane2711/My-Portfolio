import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import type { Prisma } from "@/generated/prisma/client";
import {
  db,
  log,
  readMarkdown,
  registerLocalFile,
  skipExisting,
  type ImportContext,
} from "./shared";

// Snapshot of the old features/projects/constants/projects.ts (deleted after
// this importer was written). Order = display order on the site.
const PROJECTS = [
  {
    title: "Enterprise Document Management System",
    subtitle: "Enterprise Document Management Platform | In Progress",
    slug: "enterprise-document-management-system",
    src: [
      "/projects/edms/ss1.png",
      "/projects/edms/ss2.png",
      "/projects/edms/ss3.png",
      "/projects/edms/ss4.png",
    ],
    description:
      "A secure enterprise platform that digitizes employee document management by centralizing HR records, automating document workflows, and providing role-based access for secure storage, retrieval, and lifecycle management.",
    date: "July 2026",
    technologies: ["React", "Adonis.js", "PostgreSQL", "TypeScript"],
  },
  {
    title: "PetExpress | Multi-Portal Pet-Care Rewards Platform",
    subtitle: "multi-portal pet-care rewards platform",
    slug: "petexpress",
    src: ["/projects/petexpress/ss1.png"],
    description:
      "Developed a scalable multi-portal pet-care platform featuring secure AdonisJS APIs, a loyalty and rewards engine, partner management, role-based authentication, and React-powered partner portals. Built to connect pet owners with businesses through a modern, high-performance SaaS architecture.",
    date: "June 2026",
    technologies: ["React", "Adonis.js", "PostgreSQL", "TypeScript"],
  },
  {
    title: "Rwaltz Web Platform Admin Dashboard",
    subtitle: "Full-Stack Enterprise CMS & Corporate Platform ",
    slug: "rwaltz-web-platform",
    src: ["/projects/rwaltz-admin/ss1.png"],
    description:
      "Developed a production-ready enterprise platform featuring a secure AdonisJS API, RBAC-enabled React admin dashboard, and SEO-optimized corporate website.",
    date: "june 2026",
    technologies: ["React", "Adonis.js", "MySQL", "TypeScript"],
  },
];

const MDX_DIR = path.join(process.cwd(), "scripts/legacy-content/projects");

async function technologyIds(names: string[]) {
  const techs = await db.technology.findMany({
    where: { name: { in: names, mode: "insensitive" } },
    select: { id: true, name: true },
  });
  const missing = names.filter((n) => !techs.some((t) => t.name.toLowerCase() === n.toLowerCase()));
  if (missing.length) log.info(`technologies not found (import them first): ${missing.join(", ")}`);
  return techs.map((t) => ({ id: t.id }));
}

async function upsertProject(
  ctx: ImportContext,
  label: string,
  slug: string,
  data: Omit<Prisma.ProjectCreateInput, "slug" | "images" | "technologies">,
  imageIds: string[],
  techIds: { id: string }[],
) {
  try {
    const existing = await db.project.findUnique({ where: { slug }, select: { id: true } });
    if (skipExisting(ctx, Boolean(existing), label)) return;
    if (!ctx.dryRun) {
      await db.$transaction(async (tx) => {
        if (existing) await tx.projectImage.deleteMany({ where: { projectId: existing.id } });
        const images = { create: imageIds.map((mediaId, order) => ({ mediaId, order })) };
        await tx.project.upsert({
          where: { slug },
          create: { ...data, slug, images, technologies: { connect: techIds } },
          update: { ...data, images, technologies: { set: techIds } },
        });
      });
    }
    if (existing) log.updated(label);
    else log.created(label);
  } catch (error) {
    log.error(label, error);
  }
}

export async function importProjects(ctx: ImportContext) {
  const known = new Set<string>();

  for (const [order, project] of PROJECTS.entries()) {
    known.add(project.slug);
    const label = `project ${project.slug}`;
    try {
      const mdxFile = path.join(MDX_DIR, `${project.slug}.mdx`);
      const content = existsSync(mdxFile) ? await readMarkdown<{ title?: string }>(mdxFile) : null;
      const imageIds = [];
      for (const src of project.src)
        imageIds.push(await registerLocalFile(ctx, src, project.title));

      await upsertProject(
        ctx,
        label,
        project.slug,
        {
          title: project.title,
          subtitle: project.subtitle.trim() || null,
          summary: project.description,
          displayDate: project.date,
          published: true,
          order,
          contentHtml: content?.html ?? "",
          toc: (content?.toc ?? []) as Prisma.InputJsonValue,
          ...(ctx.dryRun ? {} : { cover: { connect: { id: imageIds[0] } } }),
        },
        ctx.dryRun ? [] : imageIds,
        ctx.dryRun ? [] : await technologyIds(project.technologies),
      );
    } catch (error) {
      log.error(label, error);
    }
  }

  // MDX write-ups with no card entry (e.g. older projects) become unpublished drafts.
  for (const file of await readdir(MDX_DIR)) {
    const slug = file.replace(/\.mdx?$/, "");
    if (known.has(slug) || !/\.mdx?$/.test(file)) continue;
    const label = `project ${slug} (draft)`;
    try {
      const content = await readMarkdown<{ title?: string; description?: string }>(
        path.join(MDX_DIR, file),
      );
      await upsertProject(
        ctx,
        label,
        slug,
        {
          title: content.data.title ?? slug,
          summary: content.data.description ?? content.plainText.slice(0, 160),
          published: false,
          order: 100,
          contentHtml: content.html,
          toc: content.toc as Prisma.InputJsonValue,
        },
        [],
        [],
      );
    } catch (error) {
      log.error(label, error);
    }
  }
}
