import Container from "./components/container";
import { Heading } from "./components/heading";
import { Landingblog } from "./components/landing-blog";
import { Projects } from "./components/projects";
import { ProfessionalExperience } from "./components/professional-experience";
import { SubHeading } from "./components/subheading";
import { Testimonials } from "./components/testimonials";
import { projects } from "./constants/projects";
import Link from "next/link";
import { IconBrandGithub, IconBrandLinkedin, IconBrandX } from "@tabler/icons-react";
import { Hero } from "./components/hero";

export default function Home() {

  return (
    <main className="min-h-screen flex items-start justify-start ">
      <Container className="min-h-screen p-4 md:pt-20 md:pb-10">
       <Hero />
        <ProfessionalExperience />
        <Projects projects={projects.slice(0, 3)} />
        <Landingblog />
        <Testimonials />
      </Container>
    </main>
  );
}
