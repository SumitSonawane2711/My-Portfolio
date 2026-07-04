import Container from '@/app/components/container';
import { Heading } from '@/app/components/heading';
import { professionalExperience } from '@/app/constants/professional-experience';
import { getExperienceFrontmatterBySlug, getSingleExperience } from '@/utils/mdx';
import { IconExternalLink } from '@tabler/icons-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const frontmatter = await getExperienceFrontmatterBySlug(slug);

    if (!frontmatter) {
        return {
            title: 'Experience Not Found',
        };
    }

    return {
        title: `${frontmatter.companyName} - Professional Experience`,
        description: frontmatter.description,
    };
}

export default async function ProfessionalExperiencePage({ params }: PageProps) {
    const { slug } = await params;
    const experience = professionalExperience.find((item) => item.slug === slug);
    const mdx = await getSingleExperience(slug);

    if (!experience || !mdx) {
        notFound();
    }

    const { content, frontmatter } = mdx;

    return (
        <main className="flex min-h-screen items-start justify-start">
            <Container className="min-h-screen p-4 md:pt-20 md:pb-10">
                <div className="mb-10">
                    <p className="text-sm text-secondary">
                        {frontmatter.dateFrom} - {frontmatter.dateTo}
                    </p>
                    <Heading className="mb-4 text-4xl font-bold">
                        {frontmatter.companyName}
                    </Heading>
                    <p className="mb-3 text-sm font-medium text-primary">{experience.role}</p>
                    <p className="max-w-2xl text-secondary">{frontmatter.description}</p>
                    {frontmatter.url && (
                        <Link
                            href={frontmatter.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary"
                        >
                            Visit company
                            <IconExternalLink className="h-4 w-4" />
                        </Link>
                    )}
                    {frontmatter.technologies && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {frontmatter.technologies.map((technology) => (
                                <span
                                    key={technology}
                                    className="rounded-md border border-neutral-200 px-2 py-1 text-xs text-secondary dark:border-neutral-800"
                                >
                                    {technology}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="prose prose-neutral dark:prose-invert">{content}</div>
            </Container>
        </main>
    );
}
