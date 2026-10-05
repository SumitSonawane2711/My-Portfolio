import "server-only";
import { revalidatePath } from "next/cache";

// The ONE place that knows which public pages show which content. When a page
// starts showing new data, add it here — every admin action goes through this.
const paths = (...list: string[]) => list.forEach((p) => revalidatePath(p));

const slugPaths = (prefix: string, slugs: (string | null | undefined)[]) =>
  [...new Set(slugs.filter(Boolean))].forEach((slug) => revalidatePath(`${prefix}/${slug}`));

export const revalidateSite = {
  projects(slugs: (string | null | undefined)[] = []) {
    paths("/", "/projects", "/sitemap.xml");
    slugPaths("/projects", slugs);
  },
  // Medium stories: listed on the home page and /blog (they link out to Medium).
  blog() {
    paths("/", "/blog");
  },
  experience(slugs: (string | null | undefined)[] = []) {
    paths("/", "/sitemap.xml");
    slugPaths("/professional-experience", slugs);
  },
  resumes(slugs: (string | null | undefined)[] = []) {
    paths("/", "/resume", "/sitemap.xml");
    slugPaths("/resume", slugs);
  },
  testimonials() {
    paths("/");
  },
  // Settings and technologies appear in the shared layout or on many pages.
  everything() {
    revalidatePath("/", "layout");
  },
  // Admin chrome (e.g. the unread inbox badge in the sidebar).
  admin() {
    revalidatePath("/admin", "layout");
  },
};
