import Link from "next/link";
import { IconExternalLink } from "@tabler/icons-react";
import { Container } from "@/shared/components/Container";
import { ContentRenderer } from "@/shared/components/ContentRenderer";
import { Heading } from "@/shared/components/Heading";
import type { ExperienceDetail } from "../interfaces/experience";

export const ExperienceDetailView = ({ experience }: { experience: ExperienceDetail }) => {
  return (
    <main className="flex min-h-screen items-start justify-start">
      <Container className="min-h-screen p-4 md:pt-20 md:pb-10">
        <div className="mb-10">
          <p className="text-sm text-secondary">{experience.period}</p>
          <Heading className="mb-4 text-4xl font-bold">{experience.company}</Heading>
          <p className="mb-3 text-sm font-medium text-primary">{experience.role}</p>
          <p className="max-w-2xl text-secondary">{experience.summary}</p>
          {experience.companyUrl && (
            <Link
              href={experience.companyUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary"
            >
              Visit company
              <IconExternalLink className="h-4 w-4" />
            </Link>
          )}
          {experience.technologies.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {experience.technologies.map((technology) => (
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
        <ContentRenderer html={experience.contentHtml} />
      </Container>
    </main>
  );
};
