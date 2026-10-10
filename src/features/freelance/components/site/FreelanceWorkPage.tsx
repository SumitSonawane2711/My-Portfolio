import Link from "next/link";
import { IconArrowLeft, IconArrowUpRight } from "@tabler/icons-react";
import type { SiteProfile } from "@/features/settings/interfaces/settings";
import type {
  FreelancePage as FreelancePageData,
  FreelanceWorkItem,
} from "@/features/freelance/interfaces/freelance";
import { CloudImage } from "@/shared/components/CloudImage";
import { TechBadgeIcon } from "@/shared/components/TechBadgeIcon";
import { BackToTop } from "./BackToTop";
import { ContactAndFooter } from "./ContactAndFooter";
import { ContactDialog } from "./ContactDialog";
import { FreelanceContact } from "./FreelanceContact";
import { FreelanceFooter } from "./FreelanceFooter";
import { FreelanceHeader } from "./FreelanceHeader";
import { sectionLinks } from "./FreelancePage";

// A project as a card: the preview image only (never the video), then the
// caption, technologies and, when it's live, a link.
const WorkCard = ({ item }: { item: FreelanceWorkItem }) => {
  const cover = item.images[0];
  const name = item.clientName || item.title;
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-2.5 transition duration-300 focus-within:border-white/25 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06] motion-reduce:hover:translate-y-0 md:p-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-800">
        {cover ? (
          <CloudImage
            publicId={cover.publicId}
            alt={cover.alt || item.title}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        ) : (
          <p className="absolute inset-x-5 bottom-5 text-lg font-semibold text-white/80">
            {item.title}
          </p>
        )}
      </div>
      <div className="flex flex-1 flex-col px-2 pt-4 pb-1.5">
        {item.displayDate && (
          <p className="text-xs font-medium tracking-wider text-neutral-500 uppercase">
            {item.displayDate}
          </p>
        )}
        <h2 className="mt-1 text-lg leading-snug font-semibold tracking-tight text-white">
          {name}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-400">{item.outcome}</p>
        {item.technologies.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Built with">
            {item.technologies.slice(0, 4).map((tech) => (
              <li
                key={tech.slug}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs text-neutral-300 ring-1 ring-white/10"
              >
                <TechBadgeIcon tech={tech} className="size-3.5" />
                {tech.name}
              </li>
            ))}
          </ul>
        )}
        {item.liveUrl && (
          <div className="mt-auto pt-4">
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm text-white transition-colors hover:border-white hover:bg-white hover:text-neutral-950 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
            >
              Visit live site
              <span className="sr-only"> of {name} (opens in a new tab)</span>
              <IconArrowUpRight
                aria-hidden
                className="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
            </a>
          </div>
        )}
      </div>
    </article>
  );
};

type FreelanceWorkPageProps = { page: FreelancePageData; profile: SiteProfile };

// /freelance/work: every freelance project (the one-pager's carousel shows
// only the first three), then the same contact section and footer.
export const FreelanceWorkPage = ({ page, profile }: FreelanceWorkPageProps) => {
  const channels = { whatsapp: page.whatsapp, email: profile.contactEmail };

  return (
    <>
      <FreelanceHeader
        name={profile.name}
        avatarPublicId={profile.avatarPublicId}
        available={profile.availableForWork}
        links={sectionLinks(page)}
        whatsapp={page.whatsapp}
        base="/freelance"
      />
      <main>
        <section
          id="top"
          data-tone="dark"
          aria-labelledby="all-work-title"
          className="bg-neutral-950 pt-36 pb-20 text-white md:pt-40 md:pb-28"
        >
          <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
            <Link
              href="/freelance#work"
              className="group/back inline-flex items-center gap-1.5 text-sm text-neutral-400 transition-colors hover:text-white"
            >
              <IconArrowLeft
                aria-hidden
                className="size-4 transition-transform group-hover/back:-translate-x-0.5"
              />
              Back to the overview
            </Link>
            <h1 id="all-work-title" className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              {page.copy.workTitle || "Work"}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-neutral-400 md:text-lg">
              Every project I&apos;ve built for clients.
            </p>

            {page.work.length === 0 ? (
              <p className="mt-12 text-neutral-400">Projects are on their way. Check back soon.</p>
            ) : (
              <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {page.work.map((item) => (
                  <li key={item.slug}>
                    <WorkCard item={item} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        <ContactAndFooter>
          <FreelanceContact
            title={page.copy.contactTitle}
            intro={page.copy.contactIntro}
            channels={channels}
          />
          <FreelanceFooter name={profile.name} socials={profile.socials} />
        </ContactAndFooter>
      </main>
      <BackToTop />
      <ContactDialog whatsapp={channels.whatsapp} email={channels.email} />
    </>
  );
};
