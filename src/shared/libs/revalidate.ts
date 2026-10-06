import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS, type CacheTag } from "./dataCache";

// The ONE place that knows which public pages show which content. When a page
// starts showing new data, add it here — every admin action goes through this.
// Each call clears the cached data (tags, see dataCache.ts) and the static pages.
const paths = (...list: string[]) => list.forEach((p) => revalidatePath(p));

// expire: 0 → the next visit reads fresh data (works in actions and route handlers).
const tags = (...list: CacheTag[]) => list.forEach((tag) => revalidateTag(tag, { expire: 0 }));

const slugPaths = (prefix: string, slugs: (string | null | undefined)[]) =>
  [...new Set(slugs.filter(Boolean))].forEach((slug) => revalidatePath(`${prefix}/${slug}`));

export const revalidateSite = {
  projects(slugs: (string | null | undefined)[] = []) {
    tags(CACHE_TAGS.projects);
    paths("/", "/projects", "/freelance", "/sitemap.xml");
    slugPaths("/projects", slugs);
  },
  // Medium stories: listed on the home page and /blog (they link out to Medium).
  blog() {
    tags(CACHE_TAGS.medium);
    paths("/", "/blog");
  },
  experience(slugs: (string | null | undefined)[] = []) {
    tags(CACHE_TAGS.experience);
    paths("/", "/sitemap.xml");
    slugPaths("/professional-experience", slugs);
  },
  resumes(slugs: (string | null | undefined)[] = []) {
    tags(CACHE_TAGS.resumes);
    paths("/", "/resume", "/sitemap.xml");
    slugPaths("/resume", slugs);
  },
  testimonials() {
    tags(CACHE_TAGS.testimonials);
    paths("/", "/freelance");
  },
  // The /freelance one-pager (its copy, services and offers).
  freelance() {
    tags(CACHE_TAGS.freelance);
    paths("/freelance");
  },
  // Settings and technologies appear in the shared layout or on many pages.
  everything() {
    tags(...Object.values(CACHE_TAGS));
    revalidatePath("/", "layout");
  },
  // Admin chrome (e.g. the unread inbox badge in the sidebar).
  admin() {
    revalidatePath("/admin", "layout");
  },
};
