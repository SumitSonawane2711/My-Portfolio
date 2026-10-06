import type { MediaRef } from "@/features/media/interfaces/media";

export type TestimonialCard = {
  id: string;
  name: string;
  /** "Role, Company" */
  byline: string | null;
  quote: string;
  avatarPublicId: string | null;
  linkedinUrl: string | null;
};

export type TestimonialAdminRow = {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  linkedinUrl: string;
  sourceNote: string;
  visible: boolean;
  freelance: boolean;
  avatar: MediaRef | null;
};
