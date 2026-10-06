import type { CSSProperties } from "react";
import { IconArrowDown, IconMessageCircle } from "@tabler/icons-react";
import { RichText } from "@/shared/components/RichText";
import type { FreelanceCopy } from "@/features/freelance/interfaces/freelance";
import { contactPillClass } from "./contactActions";
import { ContactButton } from "./ContactDialog";
import { NatureBackground } from "./NatureBackground";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

// The nature photo's sky/scenery behind the hero, washed out to a soft cream
// so the text reads like it's printed on the photo (see NatureBackground).
export const FreelanceHero = ({ copy }: { copy: FreelanceCopy }) => (
  <section
    id="top"
    data-tone="light"
    aria-labelledby="hero-title"
    className="relative isolate flex min-h-[88svh] items-center bg-stone-50 pt-38 pb-24 text-neutral-900"
  >
    <NatureBackground focus="top" priority />
    {/* Misty wash over the whole photo, stronger behind the text and at the
        bottom edge, so the image only shows softly around it. */}
    <div aria-hidden className="absolute inset-0 -z-10 bg-stone-50/20" />
    <div
      aria-hidden
      className="absolute inset-0 -z-10 bg-gradient-to-r from-stone-50/85 via-stone-50/40 via-45% to-transparent"
    />
    <div
      aria-hidden
      className="absolute inset-0 -z-10 bg-gradient-to-b from-stone-50/60 via-transparent via-40% to-stone-50/90"
    />
    <div className="mx-auto w-full max-w-6xl px-6 md:px-16">
      <h1 id="hero-title" className="max-w-5xl font-bold tracking-tight text-balance">
        {copy.greeting && (
          <span className="fade-up block text-2xl text-amber-700 sm:text-3xl lg:text-4xl">
            {copy.greeting}
          </span>
        )}
        <span
          className="fade-up mt-2 block text-3xl leading-[1.12] sm:text-4xl lg:text-[3.25rem]"
          style={delay(80)}
        >
          {copy.headline}
        </span>
      </h1>

      {copy.intro && (
        <div className="fade-up mt-7 max-w-xl" style={delay(160)}>
          <RichText
            text={copy.intro}
            className="text-base leading-relaxed text-neutral-600 md:text-lg"
            boldClassName="text-neutral-900"
          />
        </div>
      )}

      <div className="fade-up mt-9 flex flex-wrap items-center gap-x-6 gap-y-4" style={delay(240)}>
        <ContactButton className={contactPillClass()}>
          <IconMessageCircle
            aria-hidden
            className="size-4 transition-transform duration-300 group-hover:-rotate-12"
          />
          Contact now
        </ContactButton>
        <a
          href="#work"
          className="group inline-flex items-center gap-2 rounded-sm text-sm text-neutral-500 transition-colors hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
        >
          or find out more
          <IconArrowDown
            aria-hidden
            className="size-4 transition-transform duration-300 group-hover:translate-y-1"
          />
        </a>
      </div>
    </div>
  </section>
);
