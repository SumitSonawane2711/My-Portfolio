import { z } from "zod";
import { SLUG_PATTERN } from "@/shared/libs/slug";

export const POST_STATUSES = ["DRAFT", "PUBLISHED", "SCHEDULED"] as const;

export const postSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150),
  slug: z
    .string()
    .trim()
    .max(80)
    .refine((s) => s === "" || SLUG_PATTERN.test(s), "Lowercase letters, numbers and dashes only")
    .refine((s) => s !== "tag", '"tag" is reserved'),
  excerpt: z.string().trim().max(300),
  coverId: z.string().nullable(),
  contentJson: z.unknown().nullable(),
  contentHtml: z.string().max(1_000_000),
  tags: z.array(z.string().trim().min(1).max(40)).max(8, "At most 8 tags"),
  status: z.enum(POST_STATUSES),
  /** ISO string (converted from the local datetime input on the client), or "" */
  publishedAt: z.union([z.iso.datetime({ offset: true }), z.literal("")]),
  seoTitle: z.string().trim().max(70),
  seoDescription: z.string().trim().max(160),
});

export type PostInput = z.infer<typeof postSchema>;

export const autosaveSchema = postSchema.pick({
  title: true,
  contentJson: true,
  contentHtml: true,
});

export type AutosaveInput = z.infer<typeof autosaveSchema>;
