import Link from "next/link";
import type { CSSProperties } from "react";
import { IconFileText, IconMail, IconMapPin } from "@tabler/icons-react";
import { SocialIcon, SOCIAL_LABELS, socialHref } from "@/shared/components/SocialIcon";
import type { SiteProfile } from "@/features/settings/interfaces/settings";

export type HeroStat = { value: string; label: string };

type HeroProps = {
  profile: Pick<
    SiteProfile,
    "heroHeading" | "heroSubheading" | "socials" | "availableForWork" | "location"
  >;
  stats: HeroStat[];
  hasResume: boolean;
};

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

// The opening "overview": who, what, how to reach me, and the numbers.
export const Hero = ({ profile, stats, hasResume }: HeroProps) => {
  return (
    <section aria-labelledby="hero-title" className="pt-10 pb-12">
      {(profile.availableForWork || profile.location) && (
        <div className="fade-up flex flex-wrap items-center gap-2 text-xs font-medium">
          {profile.availableForWork && (
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-70 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Available for work
            </span>
          )}
          {profile.location && (
            <span className="inline-flex items-center gap-1 text-secondary">
              <IconMapPin aria-hidden className="size-3.5" />
              {profile.location}
            </span>
          )}
        </div>
      )}

      <h1
        id="hero-title"
        className="fade-up mt-5 text-4xl font-bold tracking-tighter text-balance text-primary md:text-5xl"
        style={delay(60)}
      >
        {profile.heroHeading}
      </h1>
      <p
        className="fade-up mt-4 max-w-2xl text-base leading-relaxed text-pretty text-secondary"
        style={delay(120)}
      >
        {profile.heroSubheading}
      </p>

      <div className="fade-up mt-7 flex flex-wrap items-center gap-3" style={delay(180)}>
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-0 motion-reduce:hover:translate-y-0 dark:bg-white dark:text-neutral-900"
        >
          <IconMail
            aria-hidden
            className="size-4 transition-transform duration-200 group-hover:-rotate-12"
          />
          Get in touch
        </Link>
        {hasResume && (
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-primary transition duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none active:translate-y-0 motion-reduce:hover:translate-y-0 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
          >
            <IconFileText aria-hidden className="size-4" />
            Resume
          </Link>
        )}
        {profile.socials.length > 0 && (
          <ul className="flex items-center gap-1" aria-label="Social profiles">
            {profile.socials.map((link) => (
              <li key={link.url}>
                <a
                  href={socialHref(link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={SOCIAL_LABELS[link.platform]}
                  title={SOCIAL_LABELS[link.platform]}
                  className="flex size-10 items-center justify-center rounded-full text-secondary transition duration-200 hover:-translate-y-0.5 hover:bg-neutral-200/70 hover:text-primary focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none motion-reduce:hover:translate-y-0 dark:hover:bg-neutral-800"
                >
                  <SocialIcon platform={link.platform} className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {stats.length > 0 && (
        <dl
          className="fade-up mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:grid-cols-4 dark:border-neutral-800 dark:bg-neutral-800"
          style={delay(240)}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white px-4 py-4 dark:bg-neutral-950">
              <dt className="text-xs text-secondary">{stat.label}</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight text-primary">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
};
