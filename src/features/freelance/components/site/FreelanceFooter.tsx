import { SOCIAL_LABELS, SocialIcon, socialHref } from "@/shared/components/SocialIcon";
import type { SocialLink } from "@/features/settings/schemas/settingsSchema";
import { NatureBackground } from "./NatureBackground";

// The usual footer row, with the bottom of the nature photo (same image as
// the hero) fading in below it, like a meadow under the page.
export const FreelanceFooter = ({ name, socials }: { name: string; socials: SocialLink[] }) => (
  <footer className="relative isolate bg-stone-100 text-neutral-500">
    <NatureBackground focus="bottom" />
    {/* Solid cream behind the footer row, clearing towards the bottom. */}
    <div
      aria-hidden
      className="absolute inset-0 -z-10 bg-gradient-to-b from-stone-100 from-20% via-stone-100/50 via-50% to-stone-100/0 to-80%"
    />
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 border-t border-neutral-900/10 px-6 py-8 sm:flex-row sm:items-center sm:justify-between md:px-10">
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
    {/* Room for the meadow to show. */}
    <div aria-hidden className="h-[36svh] md:h-[46svh]" />
  </footer>
);
