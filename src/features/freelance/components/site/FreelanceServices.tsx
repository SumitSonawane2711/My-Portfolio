import { IconChevronDown } from "@tabler/icons-react";
import { RichText } from "@/shared/components/RichText";
import type { FreelanceService } from "@/features/freelance/interfaces/freelance";

type FreelanceServicesProps = { title: string; intro: string; services: FreelanceService[] };

// "What I do": intro on the left, a numbered accordion on the right. Native
// <details name="…"> keeps one item open at a time without JavaScript.
export const FreelanceServices = ({ title, intro, services }: FreelanceServicesProps) => {
  if (services.length === 0) return null;

  return (
    <section
      id="services"
      data-tone="dark"
      aria-labelledby="services-title"
      className="bg-neutral-950 py-24 text-white md:py-32"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 md:px-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div className="reveal lg:sticky lg:top-28 lg:self-start">
          <h2 id="services-title" className="text-3xl font-bold tracking-tight md:text-5xl">
            {title}
          </h2>
          {intro && (
            <RichText
              text={intro}
              className="mt-6 text-lg leading-relaxed text-neutral-400"
              boldClassName="text-white"
            />
          )}
        </div>

        <div className="relative">
          {/* The rail connecting the numbers. */}
          <span aria-hidden className="absolute top-6 bottom-6 left-5 w-px bg-white/15 md:left-6" />
          <ol className="relative flex flex-col gap-3">
            {services.map((service, index) => (
              <li key={service.id} className="group/item reveal relative flex gap-4 md:gap-6">
                <span
                  aria-hidden
                  className="relative z-10 mt-4 flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-sm font-semibold text-neutral-300 ring-4 ring-neutral-950 transition-colors duration-300 group-has-[details[open]]/item:bg-amber-400 group-has-[details[open]]/item:text-neutral-950 md:size-12"
                >
                  {index + 1}
                </span>
                <details
                  name="freelance-services"
                  open={index === 0}
                  className="group/details min-w-0 flex-1 rounded-3xl bg-white/[0.04] ring-1 ring-white/10 transition-colors duration-300 open:bg-white/[0.07] hover:ring-white/20"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl px-6 py-5 text-lg font-semibold focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none md:px-8 md:py-6 md:text-xl [&::-webkit-details-marker]:hidden">
                    {service.title}
                    <IconChevronDown
                      aria-hidden
                      className="size-5 shrink-0 text-neutral-400 transition-transform duration-300 group-open/details:rotate-180"
                    />
                  </summary>
                  <div className="px-6 pb-6 text-base leading-relaxed text-neutral-300 md:px-8 md:pb-8">
                    <p>{service.summary}</p>
                    {service.details && (
                      <RichText
                        text={service.details}
                        className="mt-4"
                        boldClassName="text-white"
                      />
                    )}
                  </div>
                </details>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
