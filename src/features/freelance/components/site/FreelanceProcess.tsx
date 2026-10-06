import { IconCheck } from "@tabler/icons-react";
import { RichText } from "@/shared/components/RichText";
import type { FreelanceCopy, FreelanceOffer } from "@/features/freelance/interfaces/freelance";
import { CtaButtons, type ContactChannels } from "./contactActions";

// Decorative: two message bubbles meeting, i.e. "we talk, then we build".
const Illustration = () => (
  <svg viewBox="0 0 240 200" aria-hidden className="h-auto w-56 md:w-64">
    <circle cx="110" cy="100" r="90" className="fill-stone-200" />
    <rect x="128" y="52" width="92" height="22" rx="11" className="fill-amber-400" />
    <path d="M128 52 l-14 -12 l4 18 z" className="fill-amber-400" />
    <rect x="30" y="92" width="96" height="22" rx="11" className="fill-white" />
    <path d="M126 92 l14 -10 l-6 16 z" className="fill-white" />
    <rect x="118" y="136" width="84" height="22" rx="11" className="fill-emerald-500" />
    <path d="M118 136 l-14 -12 l4 18 z" className="fill-emerald-500" />
  </svg>
);

type FreelanceProcessProps = {
  copy: Pick<FreelanceCopy, "processTitle" | "processIntro" | "offersTitle" | "availabilityNote">;
  offers: FreelanceOffer[];
  channels: ContactChannels;
};

export const FreelanceProcess = ({ copy, offers, channels }: FreelanceProcessProps) => (
  <section
    id="process"
    data-tone="light"
    aria-labelledby="process-title"
    className="bg-stone-50 py-24 text-neutral-900 md:py-32"
  >
    <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
      <div className="reveal flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <h2 id="process-title" className="text-3xl font-bold tracking-tight md:text-5xl">
            {copy.processTitle}
          </h2>
          {copy.processIntro && (
            <RichText
              text={copy.processIntro}
              className="mt-6 text-lg leading-relaxed text-neutral-600"
              boldClassName="text-neutral-900"
            />
          )}
        </div>
        <Illustration />
      </div>

      {offers.length > 0 && (
        <>
          <h3 className="reveal mt-20 text-2xl font-bold tracking-tight md:text-3xl">
            {copy.offersTitle}
          </h3>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {offers.map((offer) => (
              <article
                key={offer.id}
                className="reveal flex flex-col overflow-hidden rounded-3xl bg-stone-200/60 ring-1 ring-neutral-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:hover:translate-y-0"
              >
                <div className="m-2 rounded-[1.25rem] bg-white p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-xl font-bold tracking-tight">{offer.name}</h4>
                    {offer.badge && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                        {offer.badge}
                      </span>
                    )}
                  </div>
                  {offer.tagline && <p className="mt-3 text-neutral-500">{offer.tagline}</p>}
                  {offer.description && (
                    <RichText
                      text={offer.description}
                      className="mt-4 leading-relaxed text-neutral-600"
                      boldClassName="text-neutral-900"
                    />
                  )}
                </div>
                {offer.deliverables.length > 0 && (
                  <div className="px-6 pt-4 pb-8 md:px-8">
                    <p className="font-semibold">What you will get</p>
                    <ul className="mt-4 flex flex-col gap-3">
                      {offer.deliverables.map((item) => (
                        <li key={item} className="flex gap-3 text-neutral-700">
                          <IconCheck
                            aria-hidden
                            className="mt-0.5 size-5 shrink-0 text-emerald-600"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        </>
      )}

      <div className="reveal mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
        <CtaButtons channels={channels} />
        {copy.availabilityNote && (
          <p className="flex items-center gap-2 text-neutral-600">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
            {copy.availabilityNote}
          </p>
        )}
      </div>
    </div>
  </section>
);
