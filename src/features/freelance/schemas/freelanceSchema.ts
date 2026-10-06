import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);

export const freelanceSettingsSchema = z.object({
  greeting: text(80),
  headline: z.string().trim().min(1, "Required").max(200),
  intro: text(1500),
  workTitle: text(120),
  workIntro: text(600),
  servicesTitle: text(120),
  servicesIntro: text(1500),
  aboutTitle: text(120),
  about: text(4000),
  processTitle: text(120),
  processIntro: text(1500),
  offersTitle: text(120),
  contactTitle: text(120),
  contactIntro: text(1000),
  availabilityNote: text(120),
  /** Digits with country code; empty turns "Message now" back into the contact form. */
  whatsapp: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s()+-]/g, ""))
    .refine(
      (value) => value === "" || /^\d{8,15}$/.test(value),
      "Digits with country code, e.g. 919876543210",
    ),
  seoTitle: text(70),
  seoDescription: text(160),
  portraitId: z.string().nullable(),
  ogImageId: z.string().nullable(),
});

export type FreelanceSettingsInput = z.input<typeof freelanceSettingsSchema>;
export type FreelanceSettingsData = z.output<typeof freelanceSettingsSchema>;

export const freelanceServiceSchema = z.object({
  title: z.string().trim().min(1, "Required").max(80),
  summary: z.string().trim().min(1, "Required").max(300),
  details: text(2000),
  visible: z.boolean(),
});

export type FreelanceServiceInput = z.infer<typeof freelanceServiceSchema>;

export const freelanceOfferSchema = z.object({
  name: z.string().trim().min(1, "Required").max(80),
  badge: text(30),
  tagline: text(200),
  description: text(1500),
  deliverables: z.array(z.string().trim().min(1).max(200)).max(8, "At most 8 items"),
  visible: z.boolean(),
});

export type FreelanceOfferInput = z.infer<typeof freelanceOfferSchema>;
