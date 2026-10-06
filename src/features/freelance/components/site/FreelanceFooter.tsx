import { SOCIAL_LABELS, SocialIcon, socialHref } from "@/shared/components/SocialIcon";
import type { SocialLink } from "@/features/settings/schemas/settingsSchema";
import { SPLIT_HALF_HEIGHT, SplitBackground } from "./SplitBackground";

// A closing band showing the background's bottom half (see SplitBackground),
// with the credits on a frosted strip at the very end.
export const FreelanceFooter = ({ name, socials }: { name: string; socials: SocialLink[] }) => (
  <footer
    className={`relative isolate flex flex-col justify-end bg-stone-100 text-neutral-500 ${SPLIT_HALF_HEIGHT}`}
  >
    <SplitBackground anchor="bottom" />
    {/* Blends out of the contact section above. */}
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 -z-10 h-1/3 bg-gradient-to-b from-stone-100 to-transparent"
    />
    <div className="mx-4 mb-4 flex flex-col gap-4 rounded-2xl bg-stone-50/80 px-6 py-5 text-neutral-600 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between md:mx-auto md:mb-6 md:w-full md:max-w-[calc(72rem-5rem)] md:px-8">
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
