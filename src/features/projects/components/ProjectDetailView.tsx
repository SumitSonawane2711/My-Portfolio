import type { ReactNode } from "react";
import { Container } from "@/shared/components/Container";
import { Heading } from "@/shared/components/Heading";
import type { Project, ProjectFrontmatter } from "../interfaces/project";
import { ProjectGallery } from "./ProjectGallery";

type ProjectDetailViewProps = {
  project: Project;
  content: ReactNode;
  frontmatter: ProjectFrontmatter;
};

export const ProjectDetailView = ({ project, content, frontmatter }: ProjectDetailViewProps) => {
  return (
    <main className="flex min-h-screen items-start justify-start">
      <Container className="min-h-screen p-4 pt-20 md:pb-10">
        <ProjectGallery images={project.src} alt={project.title} />
        <div>
          <Heading className="my-4 text-4xl font-bold">{frontmatter.title}</Heading>
          <p className="shrink-0 py-2 text-sm text-secondary">{project.date}</p>
          <p className="mb-4 text-secondary">{project.description}</p>
        </div>
        <div className="prose prose-neutral dark:prose-invert">{content}</div>
      </Container>
    </main>
  );
};
