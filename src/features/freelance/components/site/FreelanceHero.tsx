import type { CSSProperties } from "react";
import { IconArrowDown } from "@tabler/icons-react";
import { RichText } from "@/shared/components/RichText";
import type { FreelanceCopy } from "@/features/freelance/interfaces/freelance";
import { CtaButtons, type ContactChannels } from "./contactActions";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export const FreelanceHero = ({
  copy,
  channels,
}: {
  copy: FreelanceCopy;
  channels: ContactChannels;
}) => (
  <section
    id="top"
    data-tone="light"
    aria-labelledby="hero-title"
    className="flex min-h-[92svh] items-center bg-stone-50 pt-28 pb-20 text-neutral-900"
  >
    <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
      <h1
        id="hero-title"
        className="max-w-5xl text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl lg:text-7xl"
      >
        {copy.greeting && <span className="fade-up block text-amber-600">{copy.greeting}</span>}
        <span className="fade-up block" style={delay(80)}>
          {copy.headline}
        </span>
      </h1>

      {copy.intro && (
        <div className="fade-up mt-8 max-w-2xl" style={delay(160)}>
          <RichText
            text={copy.intro}
            className="text-lg leading-relaxed text-neutral-600 md:text-xl"
            boldClassName="text-neutral-900"
          />
        </div>
      )}

      <div className="fade-up mt-10 flex flex-wrap items-center gap-x-6 gap-y-4" style={delay(240)}>
        <CtaButtons channels={channels} />
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
