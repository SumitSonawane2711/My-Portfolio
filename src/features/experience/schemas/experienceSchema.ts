import { z } from "zod";
import { SLUG_PATTERN } from "@/shared/libs/slug";

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

export const experienceSchema = z
  .object({
    company: z.string().trim().min(1, "Company is required").max(100),
    slug: z
      .string()
      .trim()
      .max(80)
      .refine(
        (s) => s === "" || SLUG_PATTERN.test(s),
        "Lowercase letters, numbers and dashes only",
      ),
    role: z.string().trim().min(1, "Role is required").max(100),
    companyUrl: z.union([z.url("Enter a full URL (https://…)"), z.literal("")]),
    location: z.string().trim().max(100),
    startMonth: z.string().regex(MONTH, "Pick a start month"),
    endMonth: z.union([z.string().regex(MONTH), z.literal("")]),
    summary: z.string().trim().min(10, "At least 10 characters").max(800),
    contentJson: z.unknown().nullable(),
    contentHtml: z.string().max(500_000),
    published: z.boolean(),
    technologyIds: z.array(z.string()),
  })
  .refine((v) => v.endMonth === "" || v.endMonth >= v.startMonth, {
    message: "End must be after start",
    path: ["endMonth"],
  });

export type ExperienceInput = z.infer<typeof experienceSchema>;

/** "2025-08" → 2025-08-01T00:00:00Z */
export const monthToDate = (month: string) => new Date(`${month}-01T00:00:00Z`);

/** Date → "2025-08" */
export const dateToMonth = (date: Date) => date.toISOString().slice(0, 7);
