import { z } from "zod";

// Bot checks for the public contact form.
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
  /** Which site the form is on (the developer portfolio or /freelance). */
  source: z.enum(["PORTFOLIO", "FREELANCE"]).default("PORTFOLIO"),
  ...botFields,
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
