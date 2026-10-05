import { cn } from "@/shared/libs/utils";
import type { ProjectCard as ProjectCardData } from "../interfaces/project";
import { ProjectCard } from "./ProjectCard";

export const ProjectGrid = ({
  projects,
  className,
}: {
  projects: ProjectCardData[];
  className?: string;
}) => (
  <ul className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
    {projects.map((project) => (
      <li key={project.slug} className="reveal">
        <ProjectCard project={project} />
      </li>
    ))}
  </ul>
);
