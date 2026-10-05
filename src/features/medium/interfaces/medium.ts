import type { MediumPostSource } from "@/generated/prisma/client";

/** A story as the public site shows it (a card that links out to Medium). */
export type MediumStory = {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  coverUrl: string | null;
  tags: string[];
  publishedAt: Date;
  featured: boolean;
};

export type MediumPostAdminRow = MediumStory & {
  source: MediumPostSource;
  hidden: boolean;
};

export type MediumSyncStatus = {
  /** The Medium link from Settings → Socials. */
  profileUrl: string | null;
  feedUrl: string | null;
  syncedAt: Date | null;
};
