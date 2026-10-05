import { z } from "zod";

const httpUrl = z
  .url("Enter a full URL, e.g. https://medium.com/@you/story-1a2b3c4d5e6f")
  .refine((url) => /^https?:\/\//.test(url), "Use an http(s) link");

/** A story added by hand (older than the RSS feed's latest ~10). */
export const mediumPostSchema = z.object({
  url: httpUrl,
  title: z.string().trim().min(1, "Title is required").max(200),
  excerpt: z.string().trim().max(300),
  coverUrl: z.union([httpUrl, z.literal("")]),
  /** "YYYY-MM-DD" from the date input. */
  publishedAt: z.iso.date("Pick the date it was published"),
  tags: z.array(z.string().trim().min(1).max(40)).max(5, "At most 5 tags"),
});

export type MediumPostInput = z.infer<typeof mediumPostSchema>;
