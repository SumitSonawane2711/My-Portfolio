import { Container } from "@/shared/components/Container";
import { Heading } from "@/shared/components/Heading";
import { projects } from "../constants/projects";
import { Projects } from "./Projects";

export const ProjectsPage = () => {
  return (
    <div className="flex min-h-screen items-start justify-start">
      <Container className="min-h-screen px-10 pt-20 md:pb-10">
        <Heading>Projects</Heading>
        {/* <SubHeading>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores qui adipisci, velit similique quidem odio iste non perspiciatis corporis aliquid.
                </SubHeading> */}
        <Projects projects={projects} />
      </Container>
    </div>
  );
};
