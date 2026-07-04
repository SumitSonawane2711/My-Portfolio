import Container from "./components/container";
import { Landingblog } from "./components/landing-blog";
import { Projects } from "./components/projects";
import { ProfessionalExperience } from "./components/professional-experience";
import { Testimonials } from "./components/testimonials";
import { projects } from "./constants/projects";
import { Hero } from "./components/hero";
import { Profile } from "./components/profile";

export default function Home() {

  return (
    <main className="min-h-screen flex items-start justify-start ">
      <Profile />
      <Container className="min-h-screen p-4 pt-10 md:pt-20 md:pb-10">
       <Hero />
        <ProfessionalExperience />
        <Projects projects={projects.slice(0, 3)} />
        <Landingblog />
        {/* <Testimonials /> */}
      </Container>
    </main>
  );
}
