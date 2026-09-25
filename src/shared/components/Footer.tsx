import Link from "next/link";
import type { SocialLink } from "@/features/settings/schemas/settingsSchema";
import { Container } from "./Container";
import { SocialIcon, SOCIAL_LABELS, socialHref } from "./SocialIcon";

export const Footer = ({ socials }: { socials: SocialLink[] }) => {
  return (
    <Container className="flex justify-between border-t border-neutral-200 px-2 py-4 dark:border-neutral-800">
      <p className="text-md text-secondary">Build with Love by Sumit</p>
      <div className="flex items-center justify-center gap-4">
        {socials.map((link) => (
          <Link key={link.url} href={socialHref(link)} aria-label={SOCIAL_LABELS[link.platform]}>
            <SocialIcon
              platform={link.platform}
              className="size-4 text-secondary hover:text-primary"
            />
          </Link>
        ))}
      </div>
    </Container>
  );
};
