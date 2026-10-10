import Link from "next/link";
import { Container } from "@/shared/components/Container";
import { ContentRenderer } from "@/shared/components/ContentRenderer";
import { Heading } from "@/shared/components/Heading";
import { SubHeading } from "@/shared/components/SubHeading";
import { ChaiButton } from "@/shared/components/chai/Button";
import { Chip } from "@/shared/components/chai/Chip";
import type { ExperienceDetail } from "../interfaces/experience";

export const ExperienceDetailView = ({ experience }: { experience: ExperienceDetail }) => {
  return (
    <main>
      <Container>
        <div className="mb-10 text-center">
          <p className="fade-up text-sm text-muted-foreground">{experience.period}</p>
          <Heading className="mt-2">{experience.company}</Heading>
          <p className="fade-up mt-2 text-sm text-foreground/80">{experience.role}</p>
          <SubHeading>{experience.summary}</SubHeading>
          {experience.technologies.length > 0 && (
            <ul className="mt-5 flex flex-wrap justify-center gap-1.5" aria-label="Technologies">
              {experience.technologies.map((technology) => (
                <li key={technology}>
                  <Chip>{technology}</Chip>
                </li>
              ))}
            </ul>
          )}
          {experience.companyUrl && (
            <ChaiButton asChild variant="outline" className="mt-6">
              <Link href={experience.companyUrl} target="_blank" rel="noreferrer">
                Visit company
              </Link>
            </ChaiButton>
          )}
        </div>
        <ContentRenderer html={experience.contentHtml} className="mx-auto" />
      </Container>
    </main>
  );
};
