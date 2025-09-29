import React from 'react';
import { projects } from '../../constants/projects';
import type { Project } from '../../constants/projects';
import Container from '@/app/components/container';
import { notFound } from 'next/navigation';
import { Heading } from '@/app/components/heading';
import Image from 'next/image';

interface PageProps {
    params: { slug: string };
}

export async function generateMetadata({ params }: PageProps) {
    return {
        title: `Project - ${params.slug}`,
    };
}

export default function ProjectPage({ params }: PageProps) {
    const project = projects.find((project: Project) => project.slug === params.slug);
    console.log("project :", project);


    if (!project) {
        notFound();  // Handles 404
    }

    return (
        <main className="min-h-screen flex items-start justify-start">
            <Container className="min-h-screen p-4 md:pt-20 md:pb-10">
                <Image
                    src={project.src}
                    alt={project.title}
                    height={500}
                    width={500}
                    className="rounded-lg mx-auto max-h-96 w-full border border-neutral-200 mb-20 shadow-xl"
                />
                <div>
                    <Heading className="text-4xl font-bold mb-4">{project.title}</Heading>
                    <p className="mb-4">{project.description}</p>
                </div>
            </Container>
        </main>
    );
}
