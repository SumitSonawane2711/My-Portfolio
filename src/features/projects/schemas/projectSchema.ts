import { z } from "zod";
import { SLUG_PATTERN } from "@/shared/libs/slug";

const optionalUrl = z.union([z.url("Enter a full URL (https://…)"), z.literal("")]);

// Shared by the client form (zodResolver) and the server actions.
export const projectSchema = z.object({
  title: z.string().trim().min(2, "At least 2 characters").max(120),
  slug: z
    .string()
    .trim()
    .max(80)
    .refine((s) => s === "" || SLUG_PATTERN.test(s), "Lowercase letters, numbers and dashes only"),
  subtitle: z.string().trim().max(160),
  summary: z.string().trim().min(10, "At least 10 characters").max(300),
  displayDate: z.string().trim().max(40),
  coverId: z.string().nullable(),
  previewVideoId: z.string().nullable(),
  imageIds: z
    .array(z.string())
    .max(12, "At most 12 gallery images")
    .transform((ids) => [...new Set(ids)]), // each image once
  contentJson: z.unknown().nullable(),
  contentHtml: z.string().max(500_000),
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  featured: z.boolean(),
  published: z.boolean(),
  /** On the developer portfolio (home, /projects, its own page). */
  portfolio: z.boolean(),
  /** On /freelance: the first three (in project order) fill the Work carousel. */
  freelance: z.boolean(),
  clientName: z.string().trim().max(80),
  outcome: z.string().trim().max(200),
  technologyIds: z.array(z.string()),
  seoTitle: z.string().trim().max(70),
  seoDescription: z.string().trim().max(160),
});

export type ProjectInput = z.infer<typeof projectSchema>;
