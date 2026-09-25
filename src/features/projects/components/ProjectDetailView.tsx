import { Container } from "@/shared/components/Container";
import { ContentRenderer } from "@/shared/components/ContentRenderer";
import { Heading } from "@/shared/components/Heading";
import type { ProjectDetail } from "../interfaces/project";
import { ProjectGallery } from "./ProjectGallery";

export const ProjectDetailView = ({ project }: { project: ProjectDetail }) => {
  return (
    <main className="flex min-h-screen items-start justify-start">
      <Container className="min-h-screen p-4 pt-20 md:pb-10">
        <ProjectGallery images={project.images} alt={project.title} />
        <div>
          <Heading className="my-4 text-4xl font-bold">{project.title}</Heading>
          <p className="shrink-0 py-2 text-sm text-secondary">{project.displayDate}</p>
          <p className="mb-4 text-secondary">{project.summary}</p>
        </div>
        <ContentRenderer html={project.contentHtml} />
      </Container>
    </main>
  );
};
