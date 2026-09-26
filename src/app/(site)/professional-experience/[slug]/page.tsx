import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperienceDetailView } from "@/features/experience/components/ExperienceDetailView";
import { getExperience, getExperienceSlugs } from "@/features/experience/queries/experienceQueries";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getExperienceSlugs()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const experience = await getExperience(slug);
  if (!experience?.hasDetails) return { title: "Experience Not Found" };

  return {
    title: `${experience.company} - Professional Experience`,
    description: experience.summary,
  };
}

export default async function ProfessionalExperienceDetail({ params }: PageProps) {
  const { slug } = await params;
  const experience = await getExperience(slug);

  // Only entries with a write-up have a detail page.
  if (!experience?.hasDetails) notFound();

  return <ExperienceDetailView experience={experience} />;
}
