import { z } from "zod";
import { SLUG_PATTERN } from "@/shared/libs/slug";

export const RESUME_STATUSES = ["ACTIVE", "UNLISTED", "ARCHIVED"] as const;

export const resumeSchema = z.object({
  title: z.string().trim().min(2, "At least 2 characters").max(80),
  slug: z
    .string()
    .trim()
    .max(60)
    .refine((s) => s === "" || SLUG_PATTERN.test(s), "Lowercase letters, numbers and dashes only")
    // /resume/download is the primary-resume download route.
    .refine((s) => s !== "download", '"download" is reserved'),
  description: z.string().trim().max(200),
  fileId: z.string().min(1, "Upload a PDF"),
  fileName: z
    .string()
    .trim()
    .regex(/^[\w.-]+\.pdf$/i, "Letters, numbers, dots, dashes or underscores, ending in .pdf"),
  status: z.enum(RESUME_STATUSES),
  notes: z.string().trim().max(1000),
});

export type ResumeInput = z.infer<typeof resumeSchema>;
