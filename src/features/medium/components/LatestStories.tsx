import { SectionHeader } from "@/shared/components/SectionHeader";
import type { MediumStory } from "../interfaces/medium";
import { StoryCard } from "./StoryCard";

// Home page: featured stories first, then the newest. Hidden when there are none.
export const LatestStories = ({ stories }: { stories: MediumStory[] }) => {
  if (stories.length === 0) return null;

  return (
    <section aria-labelledby="writing-title" className="py-12 sm:py-16">
      <SectionHeader
        id="writing-title"
        title="Writing"
        description={
          <>
            Notes on <span className="highlight">building software</span>, published on Medium.
          </>
        }
        action={{ href: "/blog", label: "All stories" }}
      />
      <ul className="mt-8 flex flex-col gap-3">
        {stories.map((story) => (
          <li key={story.id} className="reveal">
            <StoryCard story={story} />
          </li>
        ))}
      </ul>
    </section>
  );
};
