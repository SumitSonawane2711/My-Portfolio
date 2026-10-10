import Link from "next/link";
import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import { CloudImage } from "@/shared/components/CloudImage";
import { RichText } from "@/shared/components/RichText";
import { TechBadgeIcon } from "@/shared/components/TechBadgeIcon";
import { cn } from "@/shared/libs/utils";
import type { FreelanceWorkItem } from "@/features/freelance/interfaces/freelance";
import { WorkCarousel } from "./WorkCarousel";
import { WorkVideo } from "./WorkVideo";

// The main preview (the screen recording, or else the first image) with up to
// two more images stacked beside it. Phones show only the main preview.
const Media = ({ item }: { item: FreelanceWorkItem }) => {
  const tile = "relative overflow-hidden rounded-2xl bg-neutral-800";
  const [first, ...others] = item.images;
  const side = (item.videoPublicId ? item.images : others).slice(0, 2);
  const zoom =
    "object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none";

  const main = item.videoPublicId ? (
    <WorkVideo publicId={item.videoPublicId} label={`Screen recording of ${item.title}`} />
  ) : first ? (
    <CloudImage
      publicId={first.publicId}
      alt={first.alt || item.title}
      fill
      sizes="(min-width: 1280px) 400px, (min-width: 768px) 32vw, 86vw"
      className={zoom}
    />
  ) : (
    <p className="absolute inset-x-6 bottom-6 text-xl font-semibold text-white/80">{item.title}</p>
  );

  return (
    <div
      className={cn("grid gap-3", side.length > 0 && "md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]")}
    >
      <div
        className={cn(
          tile,
          // Beside the side images 16:10; alone it spans the card, so wider.
          "aspect-[5/4]",
          side.length > 0 ? "md:aspect-[16/10]" : "md:aspect-[2/1]",
        )}
      >
        {main}
      </div>
      {side.length > 0 && (
        <div className="hidden grid-rows-2 gap-3 md:grid">
          {side.map((image) => (
            <div key={image.publicId} className={cn(tile, side.length === 1 && "row-span-2")}>
              <CloudImage
                publicId={image.publicId}
                alt={image.alt || item.title}
                fill
                sizes="(min-width: 1280px) 140px, 11vw"
                className={zoom}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// One project per slide: the media on top, then a compact caption (title and
// date, two lines of outcome, the technologies and, when the project is live,
// a link at the end of that row). Hover/focus brightens the border and lifts it.
const Slide = ({ item }: { item: FreelanceWorkItem }) => {
  const name = item.clientName || item.title;
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-2.5 transition duration-300 focus-within:border-white/25 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-black/40 motion-reduce:hover:translate-y-0 md:p-3">
      <Media item={item} />
      <div className="flex flex-1 flex-col px-2 pt-3.5 pb-1 md:px-3 md:pt-4">
        <div className="flex flex-col-reverse gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
          <h3
            title={name}
            className="line-clamp-2 text-lg leading-snug font-semibold tracking-tight text-white md:line-clamp-1"
          >
            {name}
          </h3>
          {item.displayDate && (
            <p className="shrink-0 text-xs font-medium tracking-wider text-neutral-500 uppercase">
              {item.displayDate}
            </p>
          )}
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-neutral-400">
          {item.outcome}
        </p>
        <div className="mt-auto flex flex-col items-start gap-3 pt-3 md:flex-row md:items-end">
          {item.technologies.length > 0 && (
            <ul className="flex min-w-0 flex-wrap gap-1.5 md:flex-1" aria-label="Built with">
              {item.technologies.slice(0, 4).map((tech) => (
                <li
                  key={tech.slug}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs text-neutral-300 ring-1 ring-white/10"
                >
                  <TechBadgeIcon tech={tech} className="size-3.5" />
                  {tech.name}
                </li>
              ))}
            </ul>
          )}
          {item.liveUrl && (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1.5 text-sm text-white transition-colors hover:border-white hover:bg-white hover:text-neutral-950 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none md:ml-auto"
            >
              Visit live site
              <span className="sr-only"> of {name} (opens in a new tab)</span>
              <IconArrowUpRight
                aria-hidden
                className="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

/** How many projects the carousel shows; the rest are on /freelance/work. */
export const CAROUSEL_PROJECTS = 3;

type FreelanceWorkProps = { title: string; intro: string; items: FreelanceWorkItem[] };

export const FreelanceWork = ({ title, intro, items }: FreelanceWorkProps) => {
  if (items.length === 0) return null;
  const featured = items.slice(0, CAROUSEL_PROJECTS);

  return (
    <section
      id="work"
      data-tone="dark"
      aria-labelledby="work-title"
      className="bg-neutral-950 pt-28 pb-12 text-white md:pt-24 md:pb-14"
    >
      <div className="reveal mx-auto mb-8 flex w-full max-w-6xl flex-wrap items-end justify-between gap-x-8 gap-y-4 px-6 md:px-10">
        <div>
          <h2 id="work-title" className="text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h2>
          {intro && (
            <RichText
              text={intro}
              className="mt-3 max-w-2xl text-base text-neutral-400 md:text-lg"
              boldClassName="text-white"
            />
          )}
        </div>
        <Link
          href="/freelance/work"
          className="group/all inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm text-white transition-colors hover:border-white hover:bg-white hover:text-neutral-950 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
        >
          View all work
          <IconArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover/all:translate-x-0.5"
          />
        </Link>
      </div>
      <WorkCarousel
        slides={featured.map((item) => (
          <Slide key={item.slug} item={item} />
        ))}
        labels={featured.map((item) => item.clientName || item.title)}
      />
    </section>
  );
};
