import { Container } from "@/shared/components/Container";
import { Heading } from "@/shared/components/Heading";
import { SubHeading } from "@/shared/components/SubHeading";
import type { ProjectCard } from "../interfaces/project";
import { ProjectGrid } from "./Projects";

export const ProjectsPage = ({ projects }: { projects: ProjectCard[] }) => {
  return (
    <main>
      <Container>
        <Heading>Projects</Heading>
        <SubHeading>
          Things I&apos;ve designed and built: the problem, the stack and{" "}
          <span className="highlight">what shipped</span>.
        </SubHeading>
        <ProjectGrid projects={projects} className="mt-10" />
      </Container>
    </main>
  );
};
