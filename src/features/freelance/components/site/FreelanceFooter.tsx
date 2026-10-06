import { SOCIAL_LABELS, SocialIcon, socialHref } from "@/shared/components/SocialIcon";
import type { SocialLink } from "@/features/settings/schemas/settingsSchema";

// Sits over the bottom of the painting (inside ContactAndFooter), so the row
// is on a light frosted strip to stay readable.
export const FreelanceFooter = ({ name, socials }: { name: string; socials: SocialLink[] }) => (
  <footer className="px-4 pb-4 text-neutral-600 md:px-10 md:pb-6">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 rounded-2xl bg-stone-50/80 px-6 py-2 shadow-sm ring-1 ring-neutral-900/5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between md:px-8">
      <p className="text-sm">
        © {new Date().getFullYear()} {name}
      </p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <ul className="flex items-center gap-1" aria-label="Social profiles">
          {socials.map((link) => (
            <li key={link.url}>
              <a
                href={socialHref(link)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={SOCIAL_LABELS[link.platform]}
                className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-neutral-900/5 hover:text-neutral-900"
              >
                <SocialIcon platform={link.platform} className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </footer>
);
