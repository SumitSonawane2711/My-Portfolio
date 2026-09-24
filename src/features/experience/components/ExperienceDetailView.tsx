import type { ReactNode } from "react";
import Link from "next/link";
import { IconExternalLink } from "@tabler/icons-react";
import { Container } from "@/shared/components/Container";
import { Heading } from "@/shared/components/Heading";
import type { ExperienceFrontmatter, ProfessionalExperience } from "../interfaces/experience";

type ExperienceDetailViewProps = {
  experience: ProfessionalExperience;
  content: ReactNode;
  frontmatter: ExperienceFrontmatter;
};

export const ExperienceDetailView = ({
  experience,
  content,
  frontmatter,
}: ExperienceDetailViewProps) => {
  return (
    <main className="flex min-h-screen items-start justify-start">
      <Container className="min-h-screen p-4 md:pt-20 md:pb-10">
        <div className="mb-10">
          <p className="text-sm text-secondary">
            {frontmatter.dateFrom} - {frontmatter.dateTo}
          </p>
          <Heading className="mb-4 text-4xl font-bold">{frontmatter.companyName}</Heading>
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
};
