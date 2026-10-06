import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { CloudImage } from "@/shared/components/CloudImage";
import { RichText } from "@/shared/components/RichText";
import { TechBadgeIcon } from "@/shared/components/TechBadgeIcon";
import { cn } from "@/shared/libs/utils";
import type { FreelanceWorkItem } from "@/features/freelance/interfaces/freelance";
import { WorkCarousel } from "./WorkCarousel";

// One big image, or a collage: the first image large, up to two beside it.
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

  if (!first) {
    return (
      <div className={cn(tile, "flex aspect-[16/10] items-end p-6")}>
        <p className="text-xl font-semibold text-white/80">{item.title}</p>
      </div>
    );
  }
  if (rest.length === 0) {
    return (
      <div className={cn(tile, "aspect-[16/10]")}>
        {image(
          first.publicId,
          first.alt,
          "(min-width: 1280px) 544px, (min-width: 768px) 56vw, 84vw",
        )}
      </div>
    );
  }
  return (
    <div className="grid aspect-[16/10] grid-cols-3 grid-rows-2 gap-2 md:gap-3">
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

const Slide = ({ item }: { item: FreelanceWorkItem }) => (
  <article className="group">
    <Collage item={item} />
    <div className="mt-5 flex flex-col items-start gap-4">
      <p className="line-clamp-3 text-base leading-relaxed text-neutral-300">
        <strong className="font-semibold text-white">{item.clientName || item.title}</strong>
        <span aria-hidden> – </span>
        <span className="sr-only">: </span>
        {item.outcome}
      </p>
      <Link
        href={`/projects/${item.slug}`}
        className="group/link inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm text-white transition-colors hover:border-white hover:bg-white hover:text-neutral-950 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
      >
        View project
        <IconArrowUpRight
          aria-hidden
          className="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
        />
      </Link>
    </div>
    {item.technologies.length > 0 && (
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Built with">
        {item.technologies.slice(0, 6).map((tech) => (
          <li
            key={tech.slug}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs text-neutral-300 ring-1 ring-white/10"
          >
            <TechBadgeIcon tech={tech} className="size-3.5" />
            {tech.name}
          </li>
        ))}
      </ul>
    )}
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
