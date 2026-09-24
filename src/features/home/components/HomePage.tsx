import { Container } from "@/shared/components/Container";
import { LandingBlog } from "@/features/blog/components/LandingBlog";
import { Projects } from "@/features/projects/components/Projects";
import { ProfessionalExperience } from "@/features/experience/components/ProfessionalExperience";
import { projects } from "@/features/projects/constants/projects";
import { Hero } from "./Hero";
import { Profile } from "./Profile";

export const HomePage = () => {
  return (
    <main className="flex min-h-screen items-start justify-start">
      <Profile />
      <Container className="min-h-screen p-4 pt-10 md:pt-20 md:pb-10">
        <Hero />
        <Projects projects={projects.slice(0, 3)} />
        <ProfessionalExperience />
        <LandingBlog />
        {/* <Testimonials /> */}
      </Container>
    </main>
  );
};
