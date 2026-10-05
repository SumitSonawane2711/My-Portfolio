import { Container } from "@/shared/components/Container";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { ProjectGrid } from "@/features/projects/components/Projects";
import { ProfessionalExperience } from "@/features/experience/components/ProfessionalExperience";
import { getHomeProjects, getProjectSlugs } from "@/features/projects/queries/projectQueries";
import { getExperiences } from "@/features/experience/queries/experienceQueries";
import { getSettings } from "@/features/settings/queries/settingsQueries";
import { Testimonials } from "@/features/testimonials/components/Testimonials";
import { getVisibleTestimonials } from "@/features/testimonials/queries/testimonialQueries";
import { LatestStories } from "@/features/medium/components/LatestStories";
import { getMediumStories } from "@/features/medium/queries/mediumQueries";
import { getActiveResumes } from "@/features/resume/queries/resumeQueries";
import { Hero, type HeroStat } from "./Hero";
import { Profile } from "./Profile";

const LATEST_STORIES = 3;

export const HomePage = async () => {
  const [projects, projectSlugs, experience, settings, testimonials, stories, resumes] =
    await Promise.all([
      getHomeProjects(3),
      getProjectSlugs(),
      getExperiences(),
      getSettings(),
      getVisibleTestimonials(),
      getMediumStories(),
      getActiveResumes(),
    ]);

  // Featured stories first, then the newest (the query already sorts by date).
  const latestStories = [...stories]
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, LATEST_STORIES);

  const stats: HeroStat[] = [
    { value: `${settings.yearsOfExperience}+`, label: "Years of experience" },
    { value: String(projectSlugs.length), label: "Projects shipped" },
    { value: String(experience.length), label: "Companies" },
    { value: String(stories.length), label: "Articles written" },
  ].filter((stat) => stat.value !== "0" && stat.value !== "0+");

  return (
    <main className="flex min-h-screen items-start justify-start">
      <Profile profile={settings} hasResume={resumes.length > 0} />
      <Container className="min-h-screen pt-20 pb-10 md:pt-24">
        <Hero profile={settings} stats={stats} hasResume={resumes.length > 0} />

        {projects.length > 0 && (
          <section aria-labelledby="projects-title" className="py-12">
            <SectionHeader
              id="projects-title"
              title="Projects"
              description="Real-world work, and the technologies behind it."
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
