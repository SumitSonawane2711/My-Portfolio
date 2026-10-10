import type { SocialLink } from "@/features/settings/schemas/settingsSchema";
import { cn } from "@/shared/libs/utils";
import { chaiButtonVariants } from "./chai/Button";
import { SocialIcon, SOCIAL_LABELS, socialHref } from "./SocialIcon";

// One quiet row: the copyright and the social icons, under a warm hairline
// that fades out at both ends.
export const Footer = ({ name, socials }: { name: string; socials: SocialLink[] }) => {
  return (
    <footer
      className={cn(
        "relative mx-auto flex w-full max-w-5xl flex-col items-center gap-3 px-6 py-6 sm:flex-row sm:justify-between sm:px-10",
        "before:absolute before:top-0 before:left-1/2 before:h-px before:w-full before:-translate-x-1/2 before:opacity-10",
        "before:[mask-image:linear-gradient(90deg,transparent_0%,black_40%,black_60%,transparent_100%)]",
        "before:bg-amber-600 dark:before:bg-orange-300",
      )}
    >
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} {name || "Sumit Sonawane"}. All rights reserved.
      </p>
      {socials.length > 0 && (
        <ul className="flex items-center gap-1" aria-label="Social profiles">
          {socials.map((link) => (
            <li key={link.url}>
              <a
                href={socialHref(link)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={SOCIAL_LABELS[link.platform]}
                title={SOCIAL_LABELS[link.platform]}
                className={cn(
                  chaiButtonVariants({ variant: "ghost", size: "icon" }),
                  "text-muted-foreground",
                )}
              >
                <SocialIcon platform={link.platform} className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </footer>
  );
};
