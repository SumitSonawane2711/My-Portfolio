import { IconArrowUpRight } from "@tabler/icons-react";
import { CloudImage } from "@/shared/components/CloudImage";
import { RichText } from "@/shared/components/RichText";
import { TechBadgeIcon } from "@/shared/components/TechBadgeIcon";
import { cn } from "@/shared/libs/utils";
import type { FreelanceWorkItem } from "@/features/freelance/interfaces/freelance";
import { WorkCarousel } from "./WorkCarousel";
import { WorkVideo } from "./WorkVideo";

// A looping screen recording, one big image, or a collage: the first image
// large, up to two beside it.
const Collage = ({ item }: { item: FreelanceWorkItem }) => {
  const [first, ...rest] = item.images;
  const tile = "relative overflow-hidden rounded-2xl bg-neutral-800";
  const image = (publicId: string, alt: string | null, sizes: string, priority = false) => (
    <CloudImage
      publicId={publicId}
      alt={alt || item.title}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
    />
  );

  if (item.videoPublicId) {
    return (
      <div className={cn(tile, "aspect-square md:aspect-[4/3]")}>
        <WorkVideo publicId={item.videoPublicId} label={`Screen recording of ${item.title}`} />
      </div>
    );
  }
  if (!first) {
    return (
      <div className={cn(tile, "flex aspect-square items-end p-6 md:aspect-[4/3]")}>
        <p className="text-xl font-semibold text-white/80">{item.title}</p>
      </div>
    );
  }
  if (rest.length === 0) {
    return (
      <div className={cn(tile, "aspect-square md:aspect-[4/3]")}>
        {image(
          first.publicId,
          first.alt,
          "(min-width: 1280px) 544px, (min-width: 768px) 56vw, 84vw",
        )}
      </div>
    );
  }
  return (
    <div className="grid aspect-square grid-cols-3 grid-rows-2 gap-2 md:aspect-[4/3] md:gap-3">
      <div className={cn(tile, "col-span-2 row-span-2")}>
        {image(
          first.publicId,
          first.alt,
          "(min-width: 1280px) 360px, (min-width: 768px) 37vw, 56vw",
        )}
      </div>
      {rest.map((img, index) => (
        <div
          key={img.publicId}
          className={cn(tile, rest.length === 1 && "row-span-2", index > 1 && "hidden")}
        >
          {image(img.publicId, img.alt, "(min-width: 1280px) 180px, (min-width: 768px) 19vw, 28vw")}
        </div>
      ))}
    </div>
  );
};

// A bordered card: the media fills most of it, then a short caption, the
// technologies, and (when the project is live) a link pinned to the bottom so
// cards of different lengths line up. Hover/focus brightens the border and
// lifts the card.
const Slide = ({ item }: { item: FreelanceWorkItem }) => (
  <article className="group border-beam flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-2.5 transition duration-300 focus-within:border-white/25 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-black/40 motion-reduce:hover:translate-y-0 md:p-3">
    <Collage item={item} />
    <div className="flex flex-1 flex-col px-2 pt-4 pb-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-white">
          {item.clientName || item.title}
        </h3>
        {item.displayDate && (
          <p className="shrink-0 text-xs font-medium tracking-wider text-neutral-500 uppercase">
            {item.displayDate}
          </p>
        )}
      </div>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-neutral-400">{item.outcome}</p>
      {item.technologies.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Built with">
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
        <div className="mt-auto pt-4">
          <a
            href={item.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm text-white transition-colors hover:border-white hover:bg-white hover:text-neutral-950 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            Visit live site
            <span className="sr-only">
              {" "}
              of {item.clientName || item.title} (opens in a new tab)
            </span>
            <IconArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
            />
          </a>
        </div>
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
