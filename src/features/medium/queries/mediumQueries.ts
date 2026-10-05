import "server-only";
import type { MediumPostAdminRow, MediumStory } from "../interfaces/medium";
import { mediumRepository } from "../repositories/mediumRepository";
import { mediumServices } from "../services/mediumServices";

/** Every visible story, newest first (/blog). */
export const getMediumStories = (): Promise<MediumStory[]> => mediumRepository.listVisible();

/** Featured stories first, then the newest (home page). */
export const getLatestMediumStories = (take: number): Promise<MediumStory[]> =>
  mediumRepository.listVisible({ take, featuredFirst: true });

export const getMediumPostsForAdmin = (): Promise<MediumPostAdminRow[]> =>
  mediumRepository.listAll();

export const getMediumSyncStatus = () => mediumServices.syncStatus();
