import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { CloudImage } from "@/shared/components/CloudImage";
import { TechBadgeIcon } from "@/shared/components/TechBadgeIcon";
import type { ProjectCard as ProjectCardData } from "../interfaces/project";

const MAX_TECH = 5;

// Equal-height card: fixed 16:10 cover, clamped text, technologies pinned to
// the bottom. The whole card is one link; hover/focus lifts it and zooms the cover.
export const ProjectCard = ({ project }: { project: ProjectCardData }) => {
  const extraTech = project.technologies.length - MAX_TECH;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:shadow-black/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
        {project.coverPublicId && (
          <CloudImage
            publicId={project.coverPublicId}
            alt={project.coverAlt || project.title}
            fill
            sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 92vw"
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        )}
        <span
          aria-hidden
          className="absolute top-3 right-3 flex size-8 translate-y-1 items-center justify-center rounded-full bg-white/90 text-neutral-900 opacity-0 shadow-sm backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 dark:bg-neutral-900/90 dark:text-neutral-100"
        >
          <IconArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {project.displayDate && (
          <p className="text-xs font-medium tracking-wide text-secondary uppercase">
            {project.displayDate}
          </p>
        )}
        <h3 className="mt-1 line-clamp-2 text-base leading-snug font-semibold tracking-tight text-primary">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-secondary">
          {project.summary}
        </p>

        {project.technologies.length > 0 && (
          <ul className="mt-auto flex flex-wrap items-center gap-1.5 pt-4" aria-label="Built with">
            {project.technologies.slice(0, MAX_TECH).map((tech) => (
              <li
                key={tech.slug}
                title={tech.name}
                className="flex size-7 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 transition-transform duration-200 group-hover:scale-105 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <TechBadgeIcon tech={tech} className="size-3.5" />
                <span className="sr-only">{tech.name}</span>
              </li>
            ))}
            {extraTech > 0 && (
              <li className="px-1 text-xs font-medium text-secondary">+{extraTech}</li>
            )}
          </ul>
        )}
      </div>
    </Link>
  );
};
