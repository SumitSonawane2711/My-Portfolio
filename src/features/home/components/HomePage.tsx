import { Container } from "@/shared/components/Container";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { ProjectGrid } from "@/features/projects/components/Projects";
import { ProfessionalExperience } from "@/features/experience/components/ProfessionalExperience";
import { getHomeProjects } from "@/features/projects/queries/projectQueries";
import { getExperiences } from "@/features/experience/queries/experienceQueries";
import { getSettings } from "@/features/settings/queries/settingsQueries";
import { Testimonials } from "@/features/testimonials/components/Testimonials";
import { getVisibleTestimonials } from "@/features/testimonials/queries/testimonialQueries";
import { LatestStories } from "@/features/medium/components/LatestStories";
import { getMediumStories } from "@/features/medium/queries/mediumQueries";
import { getActiveResumes } from "@/features/resume/queries/resumeQueries";
import { getTechnologyBadges } from "@/features/technologies/queries/technologyQueries";
import { Hero } from "./Hero";
import { Profile } from "./Profile";

const LATEST_STORIES = 3;

export const HomePage = async () => {
  const [projects, experience, settings, testimonials, stories, resumes, technologies] =
    await Promise.all([
      getHomeProjects(3),
      getExperiences(),
      getSettings(),
      getVisibleTestimonials(),
      getMediumStories(),
      getActiveResumes(),
      getTechnologyBadges(),
    ]);

  // Featured stories first, then the newest (the query already sorts by date).
  const latestStories = [...stories]
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, LATEST_STORIES);

  return (
    <main>
      <Profile profile={settings} hasResume={resumes.length > 0} />
      <Container className="pt-0 sm:pt-0">
        <Hero profile={settings} hasResume={resumes.length > 0} technologies={technologies} />

        {projects.length > 0 && (
          <section aria-labelledby="projects-title" className="py-12 sm:py-16">
            <SectionHeader
              id="projects-title"
              title="Projects"
              description={
                <>
                  Real-world work, and the <span className="highlight">technologies</span> behind
                  it.
                </>
              }
              action={{ href: "/projects", label: "All projects" }}
            />
            <ProjectGrid projects={projects} className="mt-8" />
          </section>
        )}

        <ProfessionalExperience experience={experience} />
        <LatestStories stories={latestStories} />
        {testimonials.length > 0 && <Testimonials items={testimonials} />}
      </Container>
    </main>
  );
};
