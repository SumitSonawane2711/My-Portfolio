import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { mediaServices } from "@/features/media/services/mediaServices";
import { settingsRepository } from "../repositories/settingsRepository";
import type { SettingsInput } from "../schemas/settingsSchema";

const empty = (s: string) => (s.trim() === "" ? null : s.trim());

/** Replaces the `{years}` placeholder used in the hero and profile texts. */
export const fillYears = (text: string, years: number) => text.replaceAll("{years}", String(years));

export const settingsServices = {
  async update(input: SettingsInput) {
    const before = await settingsRepository.get();
    await settingsRepository.update({
      name: input.name,
      siteTitle: input.siteTitle,
      siteDescription: input.siteDescription,
      heroHeading: input.heroHeading,
      heroSubheading: input.heroSubheading,
      summary: input.summary,
      about: input.about,
      contactEmail: empty(input.contactEmail),
      phone: empty(input.phone),
      location: empty(input.location),
      availableForWork: input.availableForWork,
      socials: input.socials as Prisma.InputJsonValue,
      avatar: input.avatarId ? { connect: { id: input.avatarId } } : { disconnect: true },
      ogImage: input.ogImageId ? { connect: { id: input.ogImageId } } : { disconnect: true },
    });
    await mediaServices.releaseManyIfUnused(
      [before.avatarId, before.ogImageId].filter(
        (id) => id !== input.avatarId && id !== input.ogImageId,
      ),
    );
  },
};
