import { IconBrandMedium } from "@tabler/icons-react";
import { Container } from "@/shared/components/Container";
import { Heading } from "@/shared/components/Heading";
import { SubHeading } from "@/shared/components/SubHeading";
import type { MediumStory } from "../interfaces/medium";
import { StoryCard } from "./StoryCard";

type BlogListPageProps = {
  stories: MediumStory[];
  /** The Medium profile from Settings → Socials. */
  profileUrl: string | null;
};

export const BlogListPage = ({ stories, profileUrl }: BlogListPageProps) => {
  return (
    <main className="flex min-h-screen items-start justify-start">
      <Container className="min-h-screen pt-28 pb-16">
        <Heading>Writing</Heading>
        <SubHeading>
          Thoughts, lessons and experiences from my journey in development. Every story opens on
          Medium.
        </SubHeading>
        {profileUrl && (
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fade-up mt-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-primary transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none motion-reduce:hover:translate-y-0 dark:border-neutral-800 dark:bg-neutral-950"
            style={{ "--delay": "160ms" } as React.CSSProperties}
          >
            <IconBrandMedium aria-hidden className="size-4" />
            Follow on Medium
          </a>
        )}

        {stories.length === 0 ? (
          <p className="mt-12 text-sm text-secondary">No stories yet. Check back soon.</p>
        ) : (
          <ul className="mt-10 flex flex-col gap-3">
            {stories.map((story) => (
              <li key={story.id} className="reveal">
                <StoryCard story={story} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </main>
  );
};
