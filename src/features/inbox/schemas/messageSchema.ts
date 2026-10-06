import { isValidPhoneNumber } from "libphonenumber-js/mobile"; // mobile numbers only
import { z } from "zod";

// Bot checks for the public contact form.
const botFields = {
  /** Honeypot — hidden from people; bots fill it in. Any value is accepted here so
   *  bots get a normal response; the service then silently drops the message. */
  website: z.string().max(500).optional(),
  turnstileToken: z.string(),
};

export const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 2000;

// Shared by the contact form (checked as you type) and the server action.
// The server additionally rejects throwaway email domains and domains that
// can't receive mail (see emailCheck.ts).
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(80, "At most 80 characters")
    .regex(/^\p{L}[\p{L}\p{M} .'-]*$/u, "Use letters, spaces, dots, apostrophes or dashes"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Please enter your email address")
    .max(254, "That email address is too long")
    .pipe(z.email("Please enter a valid email address")),
  /** International format: "+" and the country code, then the number. */
  phone: z
    .string()
    .trim()
    .min(1, "Please enter your mobile number")
    .refine((phone) => isValidPhoneNumber(phone), "Please enter a valid mobile number"),
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN, `Please write at least ${MESSAGE_MIN} characters`)
    .max(MESSAGE_MAX, `At most ${MESSAGE_MAX} characters`),
  /** Which site the form is on (the developer portfolio or /freelance). */
  source: z.enum(["PORTFOLIO", "FREELANCE"]).default("PORTFOLIO"),
  ...botFields,
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
