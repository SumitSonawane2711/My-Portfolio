"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { cn } from "@/shared/libs/utils";

type WorkCarouselProps = {
  /** One element per slide (rendered on the server). */
  slides: ReactNode[];
  labels: string[];
};

// How long each project stays before the carousel moves on.
const SLIDE_MS = 6000;

// Native scroll-snap carousel: swipe/scroll works without JavaScript; this
// component adds the previous/next buttons and the progress bars, and moves
// to the next project on its own (looping), paused while the visitor hovers or
// focuses it, while it's off screen, and never with reduced motion.
export const WorkCarousel = ({ slides, labels }: WorkCarouselProps) => {
  const trackRef = useRef<HTMLUListElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false); // hovered or focused
  const [onScreen, setOnScreen] = useState(false);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAutoplay(!reduced.matches);
    const frame = requestAnimationFrame(sync);
    reduced.addEventListener("change", sync);
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0.3,
    });
    observer.observe(root);
    return () => {
      cancelAnimationFrame(frame);
      reduced.removeEventListener("change", sync);
      observer.disconnect();
    };
  }, []);

  // The current slide is the one closest to the snap point; at the very end
  // (where the last slides can't reach it) it's the last one. Several cards
  // can be visible at once, so "is it visible" isn't enough.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const slides = [...track.querySelectorAll<HTMLElement>("[data-index]")];
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) {
        setActive(slides.length - 1);
        return;
      }
      const start = track.getBoundingClientRect().left;
      let best = 0;
      let bestDistance = Infinity;
      slides.forEach((slide, index) => {
        const margin = parseFloat(getComputedStyle(slide).scrollMarginLeft) || 0;
        const distance = Math.abs(slide.getBoundingClientRect().left - start - margin);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Scroll the track sideways only. (scrollIntoView would also scroll the page
  // up or down to bring the whole slide into view.)
  const go = (index: number) => {
    const track = trackRef.current;
    const slide = track?.querySelector<HTMLElement>(`[data-index="${index}"]`);
    if (!track || !slide) return;
    const offset = slide.getBoundingClientRect().left - track.getBoundingClientRect().left;
    const margin = parseFloat(getComputedStyle(slide).scrollMarginLeft) || 0;
    track.scrollTo({ left: track.scrollLeft + offset - margin, behavior: "smooth" });
  };

  const many = slides.length > 1;
  const count = slides.length;
  // Both ends wrap around, so the carousel loops.
  const step = (by: number) => go((active + by + count) % count);
  const running = autoplay && many;

  return (
    <div
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="Selected work"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHeld(false);
      }}
    >
      {many && (
        <div className="mx-auto mb-6 flex w-full max-w-6xl items-center justify-between gap-6 px-6 md:px-10">
          <div className="flex flex-1 gap-1.5" aria-hidden>
            {slides.map((_, index) => (
              <span
                key={index}
                className="h-0.5 max-w-16 flex-1 overflow-hidden rounded-full bg-white/15"
              >
                {running && index === active ? (
                  // Fills up while this project is shown; when it's full the
                  // carousel moves on. Pausing the animation pauses the carousel.
                  <span
                    key={active}
                    onAnimationEnd={() => step(1)}
                    className="block h-full origin-left animate-[carousel-fill_linear_forwards] bg-white"
                    style={{
                      animationDuration: `${SLIDE_MS}ms`,
                      animationPlayState: held || !onScreen ? "paused" : "running",
                    }}
                  />
                ) : (
                  <span
                    className={cn(
                      "block h-full origin-left bg-white transition-transform duration-500",
                      index <= active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                )}
              </span>
            ))}
          </div>
          <p className="text-sm text-neutral-400 tabular-nums" aria-live="polite">
            {active + 1} / {slides.length}
            <span className="sr-only">: {labels[active]}</span>
          </p>
          <div className="flex gap-2">
            {[
              { label: "Previous project", Icon: IconArrowLeft, by: -1 },
              { label: "Next project", Icon: IconArrowRight, by: 1 },
            ].map(({ label, Icon, by }) => (
              <button
                key={label}
                type="button"
                onClick={() => step(by)}
                aria-label={label}
                className="flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-white hover:bg-white hover:text-neutral-950 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
              >
                <Icon className="size-5" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* The track scrolls sideways, which also clips vertically: pt/pb leave room
          for a card lifted on hover and its shadow. */}
      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pt-2 pb-10 [scrollbar-width:none] md:px-10 xl:px-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, index) => (
          <li
            key={index}
            data-index={index}
            // Each card's border light (.border-beam) starts at a different point.
            style={{ "--beam-delay": `${index * -2.3}s` } as CSSProperties}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}: ${labels[index]}`}
            // relative keeps absolutely positioned children (e.g. sr-only text)
            // inside the scroller, so off-screen slides can't widen the page.
            className="relative w-[84%] shrink-0 snap-start scroll-ml-6 sm:w-[68%] md:w-[56%] md:scroll-ml-10 lg:w-[44%] xl:w-[34rem] xl:scroll-ml-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))]"
          >
            {slide}
          </li>
        ))}
      </ul>
    </div>
  );
};
