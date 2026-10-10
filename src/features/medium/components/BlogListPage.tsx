import { IconBrandMedium } from "@tabler/icons-react";
import { Container } from "@/shared/components/Container";
import { ChaiButton } from "@/shared/components/chai/Button";
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
    <main>
      <Container>
        <Heading>Writing</Heading>
        <SubHeading>
          Thoughts, lessons and experiences from my <span className="highlight">journey</span> in
          development. Every story opens on Medium.
        </SubHeading>
        {profileUrl && (
          <div
            className="fade-up mt-6 text-center"
            style={{ "--delay": "160ms" } as React.CSSProperties}
          >
            <ChaiButton asChild variant="outline">
              <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                <IconBrandMedium aria-hidden className="size-4" />
                Follow on Medium
              </a>
            </ChaiButton>
          </div>
        )}

        {stories.length === 0 ? (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            No stories yet. Check back soon.
          </p>
        ) : (
          <ul className="mx-auto mt-10 flex max-w-4xl flex-col gap-3">
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
