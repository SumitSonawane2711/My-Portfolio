import type { MediaRef } from "@/features/media/interfaces/media";

export type ResumeStatus = "ACTIVE" | "UNLISTED" | "ARCHIVED";

/** What the public resume page renders. */
export type PublicResume = {
  title: string;
  slug: string;
  description: string | null;
  fileName: string;
  status: ResumeStatus;
  isPrimary: boolean;
  /** Inline PDF URL for the preview iframe. */
  viewUrl: string;
  /** Counted download: /resume/<slug>/download */
  downloadPath: string;
  updatedAt: Date;
};

export type ResumeAdminRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  fileName: string;
  status: ResumeStatus;
  isPrimary: boolean;
  downloadCount: number;
  notes: string;
  file: MediaRef;
  updatedAt: Date;
};
