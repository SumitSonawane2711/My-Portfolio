import { z } from "zod";

// Fields every public form shares: bot checks.
const botFields = {
  /** Honeypot — hidden from people; bots fill it in. Any value is accepted here so
   *  bots get a normal response; the service then silently drops the message. */
  website: z.string().max(500).optional(),
  turnstileToken: z.string(),
};

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(80),
  email: z.email("Please enter a valid email address"),
  message: z.string().trim().min(10, "At least 10 characters").max(2000),
  ...botFields,
});

export type ContactInput = z.infer<typeof contactSchema>;

export const FEEDBACK_KINDS = ["SUGGESTION", "CORRECTION", "THOUGHT"] as const;

export const feedbackSchema = z.object({
  postSlug: z.string().max(100),
  kind: z.enum(FEEDBACK_KINDS),
  message: z.string().trim().min(10, "At least 10 characters").max(2000),
  quotedText: z.string().trim().max(500),
  name: z.string().trim().max(80),
  email: z.union([z.email("Please enter a valid email address"), z.literal("")]),
  ...botFields,
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
