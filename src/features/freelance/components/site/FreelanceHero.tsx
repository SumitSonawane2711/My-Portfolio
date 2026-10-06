import type { CSSProperties } from "react";
import { IconArrowDown, IconMessageCircle } from "@tabler/icons-react";
import { RichText } from "@/shared/components/RichText";
import type { FreelanceCopy } from "@/features/freelance/interfaces/freelance";
import { contactPillClass } from "./contactActions";
import { ContactButton } from "./ContactDialog";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export const FreelanceHero = ({ copy }: { copy: FreelanceCopy }) => (
  <section
    id="top"
    data-tone="light"
    aria-labelledby="hero-title"
    className="flex min-h-[88svh] items-center bg-stone-50 pt-32 pb-20 text-neutral-900"
  >
    <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
      <h1 id="hero-title" className="max-w-4xl font-bold tracking-tight text-balance">
        {copy.greeting && (
          <span className="fade-up block text-2xl text-amber-600 sm:text-3xl lg:text-4xl">
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
        <div className="fade-up mt-7 max-w-2xl" style={delay(160)}>
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
