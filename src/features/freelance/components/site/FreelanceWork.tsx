import { IconArrowUpRight } from "@tabler/icons-react";
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
      sizes="(min-width: 1280px) 760px, (min-width: 768px) 62vw, 86vw"
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
          "aspect-square",
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
                sizes="(min-width: 1280px) 250px, 20vw"
                className={zoom}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// One project per slide: the media on top, then the caption (date above the
// title on phones, beside it on wider screens), the technologies and, when
// the project is live, a link. Hover/focus brightens the border and lifts it.
const Slide = ({ item }: { item: FreelanceWorkItem }) => (
  <article className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-2.5 transition duration-300 focus-within:border-white/25 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-black/40 motion-reduce:hover:translate-y-0 md:p-3">
    <Media item={item} />
    <div className="flex flex-1 flex-col gap-4 px-2 pt-4 pb-1.5 md:flex-row md:items-end md:justify-between md:gap-8 md:px-3 md:pt-5">
      <div className="min-w-0 md:max-w-2xl">
        <div className="flex flex-col-reverse gap-1 md:flex-row md:items-baseline md:gap-3">
          <h3 className="text-lg leading-snug font-semibold tracking-tight text-white md:text-xl">
            {item.clientName || item.title}
          </h3>
          {item.displayDate && (
            <p className="shrink-0 text-xs font-medium tracking-wider text-neutral-500 uppercase">
              {item.displayDate}
            </p>
          )}
        </div>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-400 md:line-clamp-2">
          {item.outcome}
        </p>
        {item.technologies.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Built with">
            {item.technologies.slice(0, 5).map((tech) => (
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
      </div>
      {item.liveUrl && (
        <a
          href={item.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link mt-auto inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-white/20 px-4 py-2 text-sm text-white transition-colors hover:border-white hover:bg-white hover:text-neutral-950 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none md:mt-0 md:self-end"
        >
          Visit live site
          <span className="sr-only"> of {item.clientName || item.title} (opens in a new tab)</span>
          <IconArrowUpRight
            aria-hidden
            className="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          />
        </a>
      )}
    </div>
  </article>
);

type FreelanceWorkProps = { title: string; intro: string; items: FreelanceWorkItem[] };

export const FreelanceWork = ({ title, intro, items }: FreelanceWorkProps) => {
  if (items.length === 0) return null;

  return (
    <section
      id="work"
      data-tone="dark"
      aria-labelledby="work-title"
      className="bg-neutral-950 py-24 text-white md:py-32"
    >
      <div className="reveal mx-auto mb-12 w-full max-w-6xl px-6 md:px-10">
        <h2 id="work-title" className="text-3xl font-bold tracking-tight md:text-5xl">
          {title}
        </h2>
        {intro && (
          <RichText
            text={intro}
            className="mt-4 max-w-2xl text-lg text-neutral-400"
            boldClassName="text-white"
          />
        )}
      </div>
      <WorkCarousel
        slides={items.map((item) => (
          <Slide key={item.slug} item={item} />
        ))}
        labels={items.map((item) => item.clientName || item.title)}
      />
    </section>
  );
};
