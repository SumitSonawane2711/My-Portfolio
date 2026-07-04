import React from 'react';
import { projects } from '../../constants/projects';
import type { Project } from '../../constants/projects';
import Container from '@/app/components/container';
import { notFound } from 'next/navigation';
import { Heading } from '@/app/components/heading';
import Image from 'next/image';
import { getProjectFrontmatterBySlug, getSingleProject } from '@/utils/mdx';

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
        <main className="min-h-screen flex items-start justify-start">
            <Container className="min-h-screen p-4 pt-20 md:pb-10">
                {/* <Image
                    src={frontmatter.image || project.src}
                    alt={frontmatter.title}
                    height={500}
                    width={900}
                    className="mx-auto mb-20 max-h-96 w-full rounded-lg border border-neutral-200 shadow-xl dark:border-neutral-800"
                /> */}
                <div>
                    <Heading className="text-4xl font-bold mb-4">{frontmatter.title}</Heading>
                    <p className='shrink-0 text-sm py-2 text-secondary'>
                        {project.date} 
                    </p>
                    <p className="mb-4 text-secondary">{project.description}</p>
                    
                </div>
                <div className="prose prose-neutral dark:prose-invert">
                    {content}
                </div>
            </Container>
        </main>
    );
}
