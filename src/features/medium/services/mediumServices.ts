import "server-only";
import { AppError } from "@/shared/libs/errors";
import { settingsRepository } from "@/features/settings/repositories/settingsRepository";
import { socialsSchema } from "@/features/settings/schemas/settingsSchema";
import type { MediumSyncStatus } from "../interfaces/medium";
import { mediumRepository } from "../repositories/mediumRepository";
import type { MediumPostInput } from "../schemas/mediumSchema";
import { cleanStoryUrl, mediumFeedUrl, mediumStoryGuid, parseMediumFeed } from "./mediumFeed";

const FETCH_TIMEOUT_MS = 10_000;

async function syncStatus(): Promise<MediumSyncStatus> {
  const settings = await settingsRepository.get();
  const socials = socialsSchema.safeParse(settings.socials);
  const profileUrl = socials.success
    ? (socials.data.find((s) => s.platform === "medium")?.url ?? null)
    : null;
  return {
    profileUrl,
    feedUrl: profileUrl ? mediumFeedUrl(profileUrl) : null,
    syncedAt: settings.mediumSyncedAt,
  };
}

async function fetchFeed(feedUrl: string) {
  let response: Response;
  try {
    response = await fetch(feedUrl, {
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch {
    throw new AppError("Couldn't reach Medium. Try again in a minute.");
  }
  if (response.status === 404) {
    throw new AppError("Medium has no feed at your profile link. Check it in Settings → Socials.");
  }
  if (!response.ok) throw new AppError(`Medium answered ${response.status}. Try again later.`);
  const xml = await response.text();
  if (!xml.includes("<rss")) {
    throw new AppError(
      "Your Medium link doesn't serve an RSS feed. Check it in Settings → Socials.",
    );
  }
  return parseMediumFeed(xml);
}

// A hand-added story gets the same guid the feed would use, so a story that
// is later seen in the feed updates this row instead of appearing twice.
const guidFor = (url: string) => mediumStoryGuid(url) ?? cleanStoryUrl(url);

const manualFields = (input: MediumPostInput) => ({
  url: cleanStoryUrl(input.url),
  title: input.title,
  excerpt: input.excerpt,
  coverUrl: input.coverUrl || null,
  tags: input.tags,
  publishedAt: new Date(`${input.publishedAt}T00:00:00Z`),
});

export const mediumServices = {
  syncStatus,

  /** Pulls the RSS feed into the database. Returns how many stories were new. */
  async sync() {
    const { feedUrl } = await syncStatus();
    if (!feedUrl) {
      throw new AppError("Add your Medium profile link in Settings → Socials first.");
    }
    const stories = await fetchFeed(feedUrl);
    const known = await mediumRepository.existingGuids(stories.map((s) => s.guid));
    if (stories.length > 0) await mediumRepository.upsertFromFeed(stories);
    await settingsRepository.update({ mediumSyncedAt: new Date() });
    return { total: stories.length, added: stories.filter((s) => !known.has(s.guid)).length };
  },

  async addManual(input: MediumPostInput) {
    const guid = guidFor(input.url);
    if (await mediumRepository.guidExists(guid)) {
      throw new AppError("This story is already in the list.");
    }
    return mediumRepository.create({ guid, ...manualFields(input), source: "MANUAL" });
  },

  /** Only hand-added stories are editable; synced ones are refreshed from Medium. */
  async updateManual(id: string, input: MediumPostInput) {
    const existing = await mediumRepository.findById(id);
    if (!existing) throw new AppError("Story not found.", "NOT_FOUND");
    if (existing.source !== "MANUAL") {
      throw new AppError("Synced stories update from Medium. Hide it instead.");
    }
    const guid = guidFor(input.url);
    if (await mediumRepository.guidExists(guid, id)) {
      throw new AppError("This story is already in the list.");
    }
    return mediumRepository.update(id, { guid, ...manualFields(input) });
  },

  /** Synced stories would come back on the next sync, so they're hidden instead. */
  async delete(id: string) {
    const existing = await mediumRepository.findById(id);
    if (!existing) throw new AppError("Story not found.", "NOT_FOUND");
    if (existing.source !== "MANUAL") {
      throw new AppError("Synced stories come back on the next sync. Hide it instead.");
    }
    await mediumRepository.delete(id);
  },

  setHidden: (id: string, hidden: boolean) => mediumRepository.update(id, { hidden }),
  setFeatured: (id: string, featured: boolean) => mediumRepository.update(id, { featured }),
};
