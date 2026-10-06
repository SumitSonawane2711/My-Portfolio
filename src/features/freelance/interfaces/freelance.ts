import type { MediaRef } from "@/features/media/interfaces/media";
import type { TestimonialCard } from "@/features/testimonials/interfaces/testimonial";
import type { TechBadge } from "@/features/technologies/interfaces/technology";

/** Section copy for /freelance. Text fields support **bold** and blank-line paragraphs. */
export type FreelanceCopy = {
  greeting: string;
  headline: string;
  intro: string;
  workTitle: string;
  workIntro: string;
  servicesTitle: string;
  servicesIntro: string;
  aboutTitle: string;
  about: string;
  processTitle: string;
  processIntro: string;
  offersTitle: string;
  contactTitle: string;
  contactIntro: string;
  availabilityNote: string;
};

export type FreelanceService = { id: string; title: string; summary: string; details: string };

export type FreelanceOffer = {
  id: string;
  name: string;
  badge: string | null;
  tagline: string;
  description: string;
  deliverables: string[];
};

export type FreelanceWorkItem = {
  slug: string;
  title: string;
  clientName: string | null;
  /** The one-line result; falls back to the project summary. */
  outcome: string;
  displayDate: string | null;
  /** Cover first, then gallery images (up to three in total). */
  images: { publicId: string; alt: string | null }[];
  technologies: TechBadge[];
};

/** Everything the public page renders (cached; see freelanceQueries). */
export type FreelancePage = {
  copy: FreelanceCopy;
  portraitPublicId: string | null;
  ogImagePublicId: string | null;
  seoTitle: string;
  seoDescription: string;
  whatsapp: string | null;
  services: FreelanceService[];
  offers: FreelanceOffer[];
  work: FreelanceWorkItem[];
  testimonials: TestimonialCard[];
};

// ── Admin ────────────────────────────────────────────────────────────────

export type FreelanceSettingsFormData = FreelanceCopy & {
  whatsapp: string;
  seoTitle: string;
  seoDescription: string;
  portrait: MediaRef | null;
  ogImage: MediaRef | null;
};

export type FreelanceServiceAdminRow = FreelanceService & { visible: boolean };
export type FreelanceOfferAdminRow = FreelanceOffer & { visible: boolean };
