"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { cn } from "@/shared/libs/utils";

type WorkCarouselProps = {
  /** One element per slide (rendered on the server). */
  slides: ReactNode[];
  labels: string[];
};

// Native scroll-snap carousel: swipe/scroll works without JavaScript; this
// component only adds the previous/next buttons and the progress bars.
export const WorkCarousel = ({ slides, labels }: WorkCarouselProps) => {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { root: track, threshold: 0.6 },
    );
    track.querySelectorAll("[data-index]").forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, []);

  const go = (index: number) => {
    const slide = trackRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`);
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  const many = slides.length > 1;

  return (
    <div aria-roledescription="carousel" aria-label="Selected work">
      {many && (
        <div className="mx-auto mb-6 flex w-full max-w-6xl items-center justify-between gap-6 px-6 md:px-10">
          <div className="flex flex-1 gap-1.5" aria-hidden>
            {slides.map((_, index) => (
              <span
                key={index}
                className="h-0.5 max-w-16 flex-1 overflow-hidden rounded-full bg-white/15"
              >
                <span
                  className={cn(
                    "block h-full origin-left bg-white transition-transform duration-500",
                    index <= active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </span>
            ))}
          </div>
          <p className="text-sm text-neutral-400 tabular-nums" aria-live="polite">
            {active + 1} / {slides.length}
            <span className="sr-only">: {labels[active]}</span>
          </p>
          <div className="flex gap-2">
            {[
              { label: "Previous project", Icon: IconArrowLeft, to: active - 1 },
              { label: "Next project", Icon: IconArrowRight, to: active + 1 },
            ].map(({ label, Icon, to }) => (
              <button
                key={label}
                type="button"
                onClick={() => go(to)}
                disabled={to < 0 || to >= slides.length}
                aria-label={label}
                className="flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-white hover:bg-white hover:text-neutral-950 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-30"
              >
                <Icon className="size-5" />
              </button>
            ))}
          </div>
        </div>
      )}

      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-4 [scrollbar-width:none] md:px-10 xl:px-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, index) => (
          <li
            key={index}
            data-index={index}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}: ${labels[index]}`}
            // relative keeps absolutely positioned children (e.g. sr-only text)
            // inside the scroller, so off-screen slides can't widen the page.
            className="relative w-[88%] shrink-0 snap-start scroll-ml-6 md:w-[80%] md:scroll-ml-10 xl:w-[64rem] xl:scroll-ml-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))]"
          >
            {slide}
          </li>
        ))}
      </ul>
    </div>
  );
};
