import Container from "./components/container";
import { Heading } from "./components/heading";
import { Landingblog } from "./components/landing-blog";
import { Projects } from "./components/projects";
import { SubHeading } from "./components/subheading";
import { Testimonials } from "./components/testimonials";
import { projects } from "./constants/projects";

export default function Home() {

  return (
    <main className="min-h-screen flex items-start justify-start ">
      <Container className="min-h-screen p-4 md:pt-20 md:pb-10">
        <Heading >Hellow World</Heading>
        <SubHeading >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, unde facere! Necessitatibus numquam iusto assumenda. Ullam quaerat exercitationem nesciunt porro!
        </SubHeading>
        <Projects projects={projects.slice(0, 3)} />
        <Landingblog />
        <Testimonials />
      </Container>
    </main>
  );
}
