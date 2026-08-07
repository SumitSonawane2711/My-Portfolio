import React from "react";
import { projects } from "../../constants/projects";
import type { Project } from "../../constants/projects";
import Container from "@/app/components/container";
import { notFound } from "next/navigation";
import { Heading } from "@/app/components/heading";
import { getProjectFrontmatterBySlug, getSingleProject } from "@/utils/mdx";
import { ProjectGallery } from "@/app/components/project-gallery";

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

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((project: Project) => project.slug === slug);
  const mdx = await getSingleProject(slug);

  if (!project || !mdx) {
    notFound();
  }

  const { content, frontmatter } = mdx;

  return (
    <main className="flex min-h-screen items-start justify-start">
      <Container className="min-h-screen p-4 pt-20 md:pb-10">
        <ProjectGallery images={project.src} alt={project.title} />
        <div>
          <Heading className="my-4 text-4xl font-bold">
            {frontmatter.title}
          </Heading>
          <p className="text-secondary shrink-0 py-2 text-sm">{project.date}</p>
          <p className="text-secondary mb-4">{project.description}</p>
        </div>
        <div className="prose prose-neutral dark:prose-invert">{content}</div>
      </Container>
    </main>
  );
}
