import type { JSONContent } from "@tiptap/react";
import type { MediaRef } from "@/features/media/interfaces/media";
import type { TocItem } from "@/shared/libs/content/process";
import type { PostStatus } from "../services/publishRules";

export type TagRef = { name: string; slug: string };

// Public view models.

export type BlogCard = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: Date;
  readingMinutes: number;
  tags: TagRef[];
};

export type BlogPost = BlogCard & {
  id: string;
  coverPublicId: string | null;
  coverAlt: string | null;
  coverWidth: number | null;
  coverHeight: number | null;
  contentHtml: string;
  toc: TocItem[];
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: Date;
};

// Admin view models.

export type PostAdminRow = {
  id: string;
  title: string;
  slug: string;
  status: PostStatus;
  publishedAt: Date | null;
  readingMinutes: number;
  likes: number;
  updatedAt: Date;
};

export type PostFormData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover: MediaRef | null;
  contentJson: JSONContent | null;
  contentHtml: string;
  tags: string[];
  status: PostStatus;
  /** ISO string or "" */
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
};
