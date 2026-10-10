import Link from "next/link";
import type { CSSProperties } from "react";
import { IconMapPin } from "@tabler/icons-react";
import { RichText } from "@/shared/components/RichText";
import { SocialIcon, SOCIAL_LABELS, socialHref } from "@/shared/components/SocialIcon";
import { TechBadgeIcon } from "@/shared/components/TechBadgeIcon";
import { ChaiButton, chaiButtonVariants } from "@/shared/components/chai/Button";
import { cn } from "@/shared/libs/utils";
import type { SiteProfile } from "@/features/settings/interfaces/settings";
import type { TechBadge } from "@/features/technologies/interfaces/technology";

type HeroProps = {
  profile: Pick<
    SiteProfile,
    "heroHeading" | "heroSubheading" | "socials" | "availableForWork" | "location"
  >;
  hasResume: boolean;
  /** Every technology, shown as a quiet cluster of icons beside the intro. */
  technologies: TechBadge[];
};

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

// A personal intro on the left (status line, headline, a lead with one
// highlighted phrase, two actions and socials) and, from md up, the
// technologies gathered on the right.
export const Hero = ({ profile, hasResume, technologies }: HeroProps) => {
  return (
    <section
      aria-labelledby="hero-title"
      className="grid items-center gap-12 pt-10 pb-16 sm:pt-16 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
    >
      <div>
        {(profile.availableForWork || profile.location) && (
          <div className="fade-up flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {profile.availableForWork && (
              <span className="inline-flex items-center gap-2 text-foreground">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-70 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                </span>
                Available for work
              </span>
            )}
            {profile.location && (
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <IconMapPin aria-hidden className="size-4" />
                {profile.location}
              </span>
            )}
          </div>
        )}

        <h1
          id="hero-title"
          className="fade-up mt-4 text-4xl font-semibold tracking-tight text-balance text-primary sm:text-5xl"
          style={delay(60)}
        >
          {profile.heroHeading}
        </h1>
        <div className="fade-up" style={delay(120)}>
          <RichText
            text={profile.heroSubheading}
            className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-neutral-500 md:text-lg dark:text-neutral-400"
            boldClassName="highlight font-medium"
          />
        </div>

        <div className="fade-up mt-8 flex flex-wrap items-center gap-3" style={delay(160)}>
          <ChaiButton asChild variant="solid" size="lg">
            <Link href="/contact">Get in touch</Link>
          </ChaiButton>
          {hasResume && (
            <ChaiButton asChild variant="outline" size="lg">
              <Link href="/resume">View resume</Link>
            </ChaiButton>
          )}
        </div>

        {profile.socials.length > 0 && (
          <ul
            className="fade-up mt-5 -ml-2 flex items-center gap-1"
            style={delay(200)}
            aria-label="Social profiles"
          >
            {profile.socials.map((link) => (
              <li key={link.url}>
                <a
                  href={socialHref(link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={SOCIAL_LABELS[link.platform]}
                  title={SOCIAL_LABELS[link.platform]}
                  className={chaiButtonVariants({ variant: "ghost", size: "icon" })}
                >
                  <SocialIcon platform={link.platform} className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {technologies.length > 0 && <TechCluster technologies={technologies} />}
    </section>
  );
};

// The technologies as a honeycomb-like cluster (four columns; every other one sits half
// a tile lower), the edges fade out, and the whole group is dimmed until hovered.
const TechCluster = ({ technologies }: { technologies: TechBadge[] }) => (
  <div className="fade-up hidden justify-center md:flex" style={delay(240)}>
    <ul
      aria-label="Technologies I work with"
      className={cn(
        "grid gap-3 pb-7 opacity-60 transition-opacity duration-300 hover:opacity-100",
        "[&>li:nth-child(even)]:translate-y-7",
        "grid-cols-4 [mask-image:radial-gradient(ellipse_farthest-corner_at_center,black_45%,transparent_92%)]",
      )}
    >
      {technologies.map((tech) => (
        <li
          key={tech.slug}
          title={tech.name}
          className="flex size-14 items-center justify-center rounded-xl border border-card-edge bg-card-fill backdrop-blur-sm transition duration-200 hover:border-card-edge-hover lg:size-16"
        >
          <TechBadgeIcon tech={tech} className="size-7 lg:size-8" />
          <span className="sr-only">{tech.name}</span>
        </li>
      ))}
    </ul>
  </div>
);
