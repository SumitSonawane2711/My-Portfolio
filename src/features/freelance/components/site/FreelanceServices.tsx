import { RichText } from "@/shared/components/RichText";
import type { FreelanceService } from "@/features/freelance/interfaces/freelance";
import { ServicesAccordion } from "./ServicesAccordion";

type FreelanceServicesProps = { title: string; intro: string; services: FreelanceService[] };

// "What I do": intro on the left, the numbered accordion on the right.
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

        <ServicesAccordion services={services} />
      </div>
    </section>
  );
};
