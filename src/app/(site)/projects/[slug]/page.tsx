import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailView } from "@/features/projects/components/ProjectDetailView";
import { getProject, getProjectSlugs } from "@/features/projects/queries/projectQueries";
import { cldUrl } from "@/shared/libs/cloudinaryUrl";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getProjectSlugs()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  const title = project.seoTitle || `${project.title} - Project`;
  const description = project.seoDescription || project.summary;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: project.coverPublicId
        ? [cldUrl(project.coverPublicId, { width: 1200, height: 630, crop: "fill" })]
        : undefined,
    },
  };
}

export default async function ProjectDetail({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailView project={project} />;
}
