import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { ArrowLink } from "@/shared/components/ArrowLink";
import { SectionHeader } from "@/shared/components/SectionHeader";
import type { ExperienceCard } from "../interfaces/experience";

// Timeline: a rail on the left with one dot per role; the current role's dot pulses.
export const ProfessionalExperience = ({ experience }: { experience: ExperienceCard[] }) => {
  if (experience.length === 0) return null;

  return (
    <section aria-labelledby="experience-title" className="py-12">
      <SectionHeader
        id="experience-title"
        title="Experience"
        description="Companies and teams I've worked with."
      />

      <ol className="relative mt-8 space-y-4 border-l border-neutral-200 pl-6 md:pl-8 dark:border-neutral-800">
        {experience.map((item) => {
          const current = item.period.endsWith("Present");
          return (
            <li key={item.slug} className="reveal relative">
              <span
                aria-hidden
                className="absolute top-6 -left-[29px] flex size-2.5 md:-left-[37px]"
              >
                {current && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
                )}
                <span
                  className={`relative inline-flex size-2.5 rounded-full ring-4 ring-white dark:ring-neutral-900 ${current ? "bg-emerald-500" : "bg-neutral-300 dark:bg-neutral-600"}`}
                />
              </span>

              <article className="rounded-2xl border border-neutral-200 bg-white p-5 transition-colors duration-200 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div>
                    <h3 className="text-base font-semibold tracking-tight text-primary">
                      {item.companyUrl ? (
                        <Link
                          href={item.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/company inline-flex items-center gap-1 rounded-sm hover:underline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none"
                        >
                          {item.company}
                          <IconArrowUpRight
                            aria-hidden
                            className="size-4 text-secondary transition-transform duration-200 group-hover/company:translate-x-0.5 group-hover/company:-translate-y-0.5"
                          />
                        </Link>
                      ) : (
                        item.company
                      )}
                    </h3>
                    <p className="text-sm font-medium text-primary/80">{item.role}</p>
                  </div>
                  <p className="shrink-0 text-xs font-medium text-secondary sm:pt-1">
                    {item.period}
                  </p>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-secondary">{item.summary}</p>

                {item.technologies.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
                    {item.technologies.map((technology) => (
                      <li
                        key={technology}
                        className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-xs text-secondary dark:border-neutral-800 dark:bg-neutral-900"
                      >
                        {technology}
                      </li>
                    ))}
                  </ul>
                )}

                {item.hasDetails && (
                  <ArrowLink href={`/professional-experience/${item.slug}`} className="mt-4">
                    Read more
                  </ArrowLink>
                )}
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
