import { Container } from "@/shared/components/Container";
import { LandingBlog } from "@/features/blog/components/LandingBlog";
import { Projects } from "@/features/projects/components/Projects";
import { ProfessionalExperience } from "@/features/experience/components/ProfessionalExperience";
import { getHomeProjects } from "@/features/projects/queries/projectQueries";
import { getExperiences } from "@/features/experience/queries/experienceQueries";
import { getSettings } from "@/features/settings/queries/settingsQueries";
import { Testimonials } from "@/features/testimonials/components/Testimonials";
import { getVisibleTestimonials } from "@/features/testimonials/queries/testimonialQueries";
import { Hero } from "./Hero";
import { Profile } from "./Profile";

export const HomePage = async () => {
  const [projects, experience, settings, testimonials] = await Promise.all([
    getHomeProjects(3),
    getExperiences(),
    getSettings(),
    getVisibleTestimonials(),
  ]);

  return (
    <main className="flex min-h-screen items-start justify-start">
      <Profile profile={settings} />
      <Container className="min-h-screen p-4 pt-10 md:pt-20 md:pb-10">
        <Hero />
        <Projects projects={projects} />
        <ProfessionalExperience experience={experience} />
        <LandingBlog />
        {testimonials.length > 0 && <Testimonials items={testimonials} />}
      </Container>
    </main>
  );
};
