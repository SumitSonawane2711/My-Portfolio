import { z } from "zod";

export const SOCIAL_PLATFORMS = [
  "github",
  "linkedin",
  "x",
  "youtube",
  "dev",
  "medium",
  "email",
  "website",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const socialLinkSchema = z.object({
  platform: z.enum(SOCIAL_PLATFORMS),
  url: z.string().trim().min(1, "Required").max(300),
});

export type SocialLink = z.infer<typeof socialLinkSchema>;

export const socialsSchema = z.array(socialLinkSchema).max(10);

export const settingsSchema = z.object({
  name: z.string().trim().min(1, "Required").max(80),
  siteTitle: z.string().trim().min(1, "Required").max(70),
  siteDescription: z.string().trim().max(160),
  heroHeading: z.string().trim().max(120),
  heroSubheading: z.string().trim().max(600),
  summary: z.string().trim().max(200),
  about: z.string().trim().max(5000),
  avatarId: z.string().nullable(),
  ogImageId: z.string().nullable(),
  contactEmail: z.union([z.email(), z.literal("")]),
  phone: z.string().trim().max(30),
  location: z.string().trim().max(100),
  availableForWork: z.boolean(),
  socials: socialsSchema,
});

export type SettingsInput = z.infer<typeof settingsSchema>;
