import type { JSONContent } from "@tiptap/react";
import type { MediaRef } from "@/features/media/interfaces/media";
import type { TechBadge } from "@/features/technologies/interfaces/technology";
import type { TocItem } from "@/shared/libs/content/process";

// Public view models — what the (unchanged) project components render.

export type ProjectCard = {
  title: string;
  slug: string;
  summary: string;
  displayDate: string | null;
  coverPublicId: string | null;
  coverAlt: string | null;
  technologies: TechBadge[];
};

export type ProjectDetail = ProjectCard & {
  subtitle: string | null;
  /** Gallery image public ids, in order (falls back to the cover). */
  images: string[];
  contentHtml: string;
  toc: TocItem[];
  liveUrl: string | null;
  repoUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

// Admin view models.

export type ProjectAdminRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  featured: boolean;
  portfolio: boolean;
  freelance: boolean;
  displayDate: string | null;
  coverPublicId: string | null;
};

export type ProjectFormData = {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  summary: string;
  displayDate: string;
  cover: MediaRef | null;
  images: MediaRef[];
  previewVideo: MediaRef | null;
  contentJson: JSONContent | null;
  contentHtml: string;
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  published: boolean;
  portfolio: boolean;
  freelance: boolean;
  clientName: string;
  outcome: string;
  technologyIds: string[];
  seoTitle: string;
  seoDescription: string;
};
