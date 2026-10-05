import "server-only";
import { CACHE_TAGS, cachedQuery } from "@/shared/libs/dataCache";
import type { MediumPostAdminRow, MediumStory } from "../interfaces/medium";
import { mediumRepository } from "../repositories/mediumRepository";
import { mediumServices } from "../services/mediumServices";

/** Every visible story, newest first (/blog and the home page). */
export const getMediumStories = cachedQuery(
  "medium:stories",
  [CACHE_TAGS.medium],
  (): Promise<MediumStory[]> => mediumRepository.listVisible(),
);

export const getMediumPostsForAdmin = (): Promise<MediumPostAdminRow[]> =>
  mediumRepository.listAll();

/** Live (uncached) status for the admin Blog page. */
export const getMediumSyncStatusForAdmin = () => mediumServices.syncStatus();

/** Profile and feed URLs come from the settings socials. */
export const getMediumSyncStatus = cachedQuery(
  "medium:status",
  [CACHE_TAGS.medium, CACHE_TAGS.settings],
  () => mediumServices.syncStatus(),
);
