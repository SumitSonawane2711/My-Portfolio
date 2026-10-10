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
      className="group flex gap-4 card-chai p-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:gap-5 sm:p-5 sm:opacity-90 sm:hover:opacity-100 sm:focus-visible:opacity-100"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <time dateTime={story.publishedAt.toISOString()}>{formatDate(story.publishedAt)}</time>
          {story.featured && <span className="highlight text-xs">Featured</span>}
          {story.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="before:mr-2 before:content-['·']">
              {tag.replace(/-/g, " ")}
            </span>
          ))}
        </p>
        <h3 className="mt-1.5 line-clamp-2 font-montserrat text-base leading-snug font-semibold text-gray-900 dark:text-gray-50">
          {story.title}
        </h3>
        {story.excerpt && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {story.excerpt}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-medium text-foreground transition-colors duration-200 group-hover:text-brand">
          Read on Medium
          <IconArrowUpRight
            aria-hidden
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
          />
        </span>
      </div>

      {story.coverUrl && (
        <div className="relative hidden aspect-[4/3] w-32 shrink-0 self-center overflow-hidden rounded-lg bg-neutral-500/10 min-[420px]:block sm:w-40">
          {/* eslint-disable-next-line @next/next/no-img-element -- Medium's CDN serves the resized image */}
          <img
            src={mediumImage(story.coverUrl, 400)}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
          />
        </div>
      )}
    </a>
  );
};
