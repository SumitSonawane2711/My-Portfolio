import type { MediaRef } from "@/features/media/interfaces/media";
import type { SocialLink } from "../schemas/settingsSchema";

/** Public, site-wide profile (replaces the old shared/constants/site.ts). */
export type SiteProfile = {
  name: string;
  siteTitle: string;
  siteDescription: string;
  /** `{years}` already replaced with the years of experience. */
  heroHeading: string;
  heroSubheading: string;
  summary: string;
  about: string;
  avatarPublicId: string | null;
  ogImagePublicId: string | null;
  contactEmail: string | null;
  phone: string | null;
  location: string | null;
  availableForWork: boolean;
  socials: SocialLink[];
  yearsOfExperience: number;
};

export type SettingsFormData = {
  name: string;
  siteTitle: string;
  siteDescription: string;
  heroHeading: string;
  heroSubheading: string;
  summary: string;
  about: string;
  avatar: MediaRef | null;
  ogImage: MediaRef | null;
  contactEmail: string;
  phone: string;
  location: string;
  availableForWork: boolean;
  socials: SocialLink[];
};
