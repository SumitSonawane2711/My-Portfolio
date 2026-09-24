import { notFound } from "next/navigation";
import { ExperienceDetailView } from "@/features/experience/components/ExperienceDetailView";
import {
  getExperienceBySlug,
  getExperienceFrontmatterBySlug,
  getSingleExperience,
} from "@/features/experience/services/experienceServices";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const frontmatter = await getExperienceFrontmatterBySlug(slug);

  if (!frontmatter) {
    return {
      title: "Experience Not Found",
    };
  }

  return {
    title: `${frontmatter.companyName} - Professional Experience`,
    description: frontmatter.description,
  };
}

export default async function ProfessionalExperienceDetail({ params }: PageProps) {
  const { slug } = await params;
  const experience = getExperienceBySlug(slug);
  const mdx = await getSingleExperience(slug);

  if (!experience || !mdx) {
    notFound();
  }

  return (
    <ExperienceDetailView
      experience={experience}
      content={mdx.content}
      frontmatter={mdx.frontmatter}
    />
  );
}
