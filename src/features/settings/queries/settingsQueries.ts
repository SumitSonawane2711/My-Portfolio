import "server-only";
import { cache } from "react";
import { getYearsOfExperience } from "@/features/experience/queries/experienceQueries";
import type { SettingsFormData, SiteProfile } from "../interfaces/settings";
import { settingsRepository } from "../repositories/settingsRepository";
import { socialsSchema } from "../schemas/settingsSchema";
import { fillYears } from "../services/settingsServices";

const parseSocials = (value: unknown) => {
  const parsed = socialsSchema.safeParse(value);
  return parsed.success ? parsed.data : [];
};

/** Site-wide settings; cached so layout, metadata and pages share one query per render. */
export const getSettings = cache(async (): Promise<SiteProfile> => {
  const [row, years] = await Promise.all([settingsRepository.get(), getYearsOfExperience()]);
  return {
    name: row.name,
    siteTitle: row.siteTitle,
    siteDescription: row.siteDescription,
    heroHeading: fillYears(row.heroHeading, years),
    heroSubheading: fillYears(row.heroSubheading, years),
    summary: fillYears(row.summary, years),
    about: fillYears(row.about, years),
    avatarPublicId: row.avatar?.publicId ?? null,
    ogImagePublicId: row.ogImage?.publicId ?? null,
    contactEmail: row.contactEmail,
    phone: row.phone,
    location: row.location,
    availableForWork: row.availableForWork,
    socials: parseSocials(row.socials),
    yearsOfExperience: years,
  };
});

export async function getSettingsForEdit(): Promise<SettingsFormData> {
  const row = await settingsRepository.get();
  return {
    name: row.name,
    siteTitle: row.siteTitle,
    siteDescription: row.siteDescription,
    heroHeading: row.heroHeading,
    heroSubheading: row.heroSubheading,
    summary: row.summary,
    about: row.about,
    avatar: row.avatar,
    ogImage: row.ogImage,
    contactEmail: row.contactEmail ?? "",
    phone: row.phone ?? "",
    location: row.location ?? "",
    availableForWork: row.availableForWork,
    socials: parseSocials(row.socials),
  };
}
