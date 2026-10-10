import { Container } from "@/shared/components/Container";
import { ContentRenderer } from "@/shared/components/ContentRenderer";
import { Heading } from "@/shared/components/Heading";
import { SubHeading } from "@/shared/components/SubHeading";
import type { ProjectDetail } from "../interfaces/project";
import { ProjectGallery } from "./ProjectGallery";

export const ProjectDetailView = ({ project }: { project: ProjectDetail }) => {
  return (
    <main>
      <Container>
        {project.displayDate && (
          <p className="fade-up text-center text-sm text-muted-foreground">{project.displayDate}</p>
        )}
        <Heading className="mt-2">{project.title}</Heading>
        <SubHeading>{project.summary}</SubHeading>
        <div className="mt-10">
          <ProjectGallery images={project.images} alt={project.title} />
        </div>
        <ContentRenderer html={project.contentHtml} className="mx-auto mt-10" />
      </Container>
    </main>
  );
};
