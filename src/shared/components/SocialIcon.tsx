import {
  IconCode,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandMedium,
  IconBrandX,
  IconBrandYoutube,
  IconMail,
  IconWorld,
  type TablerIcon,
} from "@tabler/icons-react";
import type { SocialLink, SocialPlatform } from "@/features/settings/schemas/settingsSchema";

const ICONS: Record<SocialPlatform, TablerIcon> = {
  github: IconBrandGithub,
  linkedin: IconBrandLinkedin,
  x: IconBrandX,
  youtube: IconBrandYoutube,
  dev: IconCode,
  medium: IconBrandMedium,
  email: IconMail,
  website: IconWorld,
};

export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  x: "X",
  youtube: "YouTube",
  dev: "DEV",
  medium: "Medium",
  email: "Email",
  website: "Website",
};

export const SocialIcon = ({
  platform,
  className,
}: {
  platform: SocialPlatform;
  className?: string;
}) => {
  const Icon = ICONS[platform];
  return <Icon className={className} aria-hidden="true" />;
};

/** mailto: for email entries that were saved as a bare address. */
export const socialHref = ({ platform, url }: SocialLink) =>
  platform === "email" && !url.startsWith("mailto:") ? `mailto:${url}` : url;
