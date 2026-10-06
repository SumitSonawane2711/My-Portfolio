import { z } from "zod";

export const testimonialSchema = z.object({
  name: z.string().trim().min(2, "At least 2 characters").max(80),
  role: z.string().trim().max(80),
  company: z.string().trim().max(80),
  avatarId: z.string().nullable(),
  quote: z.string().trim().min(10, "At least 10 characters").max(600),
  linkedinUrl: z.union([z.url("Enter a full URL (https://…)"), z.literal("")]),
  sourceNote: z.string().trim().max(500),
  visible: z.boolean(),
  /** Also shown on /freelance. */
  freelance: z.boolean(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
