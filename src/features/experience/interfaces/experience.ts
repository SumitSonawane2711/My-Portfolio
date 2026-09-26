import type { JSONContent } from "@tiptap/react";

// Public view models.

export type ExperienceCard = {
  company: string;
  slug: string;
  role: string;
  companyUrl: string | null;
  /** "Aug 2025 - Present" */
  period: string;
  summary: string;
  technologies: string[];
  /** True when there is a write-up, i.e. the detail page exists. */
  hasDetails: boolean;
};

export type ExperienceDetail = ExperienceCard & {
  location: string | null;
  contentHtml: string;
};

// Admin view models.

export type ExperienceAdminRow = {
  id: string;
  company: string;
  role: string;
  period: string;
  published: boolean;
};

export type ExperienceFormData = {
  id: string;
  company: string;
  slug: string;
  role: string;
  companyUrl: string;
  location: string;
  /** "YYYY-MM" (input type="month") */
  startMonth: string;
  /** "YYYY-MM", or "" for a current role */
  endMonth: string;
  summary: string;
  contentJson: JSONContent | null;
  contentHtml: string;
  published: boolean;
  technologyIds: string[];
};
