import Link from "next/link";
import type { SocialLink } from "@/features/settings/schemas/settingsSchema";
import { NAV_ITEMS } from "@/shared/constants/nav";
import { Container } from "./Container";
import { SocialIcon, SOCIAL_LABELS, socialHref } from "./SocialIcon";

export const Footer = ({ name, socials }: { name: string; socials: SocialLink[] }) => {
  return (
    <footer>
      <Container className="flex flex-col gap-4 border-t border-neutral-200 py-8 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
        <p className="text-sm text-secondary">
          © {new Date().getFullYear()} {name || "Sumit Sonawane"} · Built with care.
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <nav aria-label="Footer" className="flex gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-secondary transition-colors hover:text-primary"
              >
                {item.title}
              </Link>
            ))}
          </nav>
          {socials.length > 0 && (
            <ul className="flex items-center gap-1" aria-label="Social profiles">
              {socials.map((link) => (
                <li key={link.url}>
                  <a
                    href={socialHref(link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_LABELS[link.platform]}
                    className="flex size-8 items-center justify-center rounded-full text-secondary transition duration-200 hover:-translate-y-0.5 hover:bg-neutral-200/70 hover:text-primary motion-reduce:hover:translate-y-0 dark:hover:bg-neutral-800"
                  >
                    <SocialIcon platform={link.platform} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </footer>
  );
};
