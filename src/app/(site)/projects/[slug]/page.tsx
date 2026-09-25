import { notFound } from "next/navigation";
import { ProjectDetailView } from "@/features/projects/components/ProjectDetailView";
import {
  getProjectBySlug,
  getProjectFrontmatterBySlug,
  getSingleProject,
} from "@/features/projects/services/projectServices";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const frontmatter = await getProjectFrontmatterBySlug(slug);

  if (!frontmatter) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${frontmatter.title} - Project`,
    description: frontmatter.description,
  };
}

export default async function ProjectDetail({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const mdx = await getSingleProject(slug);

  if (!project || !mdx) {
    notFound();
  }

  return (
    <ProjectDetailView project={project} content={mdx.content} frontmatter={mdx.frontmatter} />
  );
}
