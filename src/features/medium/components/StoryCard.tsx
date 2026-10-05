import { IconArrowUpRight } from "@tabler/icons-react";
import { formatDate } from "@/shared/libs/format";
import type { MediumStory } from "../interfaces/medium";
import { mediumImage } from "../services/mediumFeed";

// One story = one external link to Medium (there is no on-site article page).
export const StoryCard = ({ story }: { story: MediumStory }) => {
  return (
    <a
      href={story.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4 transition duration-200 hover:border-neutral-300 hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none sm:gap-5 sm:p-5 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-secondary">
          <time dateTime={story.publishedAt.toISOString()}>{formatDate(story.publishedAt)}</time>
          {story.featured && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800 dark:bg-amber-400/15 dark:text-amber-300">
              Featured
            </span>
          )}
          {story.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="before:mr-2 before:content-['·']">
              {tag.replace(/-/g, " ")}
            </span>
          ))}
        </p>
        <h3 className="mt-1.5 line-clamp-2 text-base leading-snug font-semibold tracking-tight text-primary decoration-neutral-400 underline-offset-4 group-hover:underline">
          {story.title}
        </h3>
        {story.excerpt && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-secondary">
            {story.excerpt}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-medium text-primary">
          Read on Medium
          <IconArrowUpRight
            aria-hidden
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
          />
        </span>
      </div>

      {story.coverUrl && (
        <div className="relative hidden aspect-[4/3] w-32 shrink-0 self-center overflow-hidden rounded-xl bg-neutral-100 min-[420px]:block sm:w-40 dark:bg-neutral-900">
          {/* eslint-disable-next-line @next/next/no-img-element -- Medium's CDN serves the resized image */}
          <img
            src={mediumImage(story.coverUrl, 400)}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
          />
        </div>
      )}
    </a>
  );
};
