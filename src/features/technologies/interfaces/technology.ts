import type { MediaRef } from "@/features/media/interfaces/media";

// View model passed to (client) components: the icon is pre-rendered on the
// server so icon sets never reach the browser.
export type TechBadge = {
  name: string;
  slug: string;
  svg: string | null;
  /** Cloudinary public id when the technology uses an uploaded icon instead. */
  customIconPublicId: string | null;
  color: string | null;
};

export type TechnologyAdminRow = TechBadge & {
  id: string;
  icon: string | null;
  customIcon: MediaRef | null;
  usage: number;
};
