import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { SOCIAL_LABELS, SocialIcon, socialHref } from "@/shared/components/SocialIcon";
import type { SocialLink } from "@/features/settings/schemas/settingsSchema";

export const FreelanceFooter = ({ name, socials }: { name: string; socials: SocialLink[] }) => (
  <footer className="bg-stone-100 text-neutral-500">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 border-t border-neutral-900/10 px-6 py-8 sm:flex-row sm:items-center sm:justify-between md:px-10">
      <p className="text-sm">
        © {new Date().getFullYear()} {name}
      </p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link
          href="/"
          className="group inline-flex items-center gap-1 text-sm transition-colors hover:text-neutral-900"
        >
          Developer portfolio
          <IconArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
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
