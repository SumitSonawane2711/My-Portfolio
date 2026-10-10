import Link from "next/link";
import { CloudImage } from "@/shared/components/CloudImage";
import { TechBadgeIcon } from "@/shared/components/TechBadgeIcon";
import { Chip } from "@/shared/components/chai/Chip";
import type { ProjectCard as ProjectCardData } from "../interfaces/project";

const MAX_TECH = 4;

// ChaiUI listing card: warm hairline, faint fill, no shadow. Slightly dimmed
// on wide screens until hovered; the cover zooms 3%. The whole card is one link.
export const ProjectCard = ({ project }: { project: ProjectCardData }) => {
  const extraTech = project.technologies.length - MAX_TECH;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden card-chai outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:opacity-90 sm:hover:opacity-100 sm:focus-visible:opacity-100"
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-neutral-500/10">
        {project.coverPublicId && (
          <CloudImage
            publicId={project.coverPublicId}
            alt={project.coverAlt || project.title}
            fill
            sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 92vw"
            className="object-cover object-top transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-4">
        <h3 className="line-clamp-2 font-montserrat text-base leading-snug font-semibold text-gray-900 dark:text-gray-50">
          {project.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {project.summary}
        </p>

        {project.technologies.length > 0 && (
          <ul className="mt-2 flex flex-wrap items-center gap-1.5" aria-label="Built with">
            {project.technologies.slice(0, MAX_TECH).map((tech) => (
              <li key={tech.slug}>
                <Chip>
                  <TechBadgeIcon tech={tech} className="size-3" />
                  {tech.name}
                </Chip>
              </li>
            ))}
            {extraTech > 0 && (
              <li>
                <Chip>+{extraTech}</Chip>
              </li>
            )}
          </ul>
        )}

        {project.displayDate && (
          <p className="mt-auto pt-3 text-xs text-muted-foreground">{project.displayDate}</p>
        )}
      </div>
    </Link>
  );
};
