import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";

/**
 * Cache tags for public data. Every admin change clears the matching tags
 * through `revalidateSite` (shared/libs/revalidate.ts), so cached reads are
 * never stale after a save; the hour-long revalidate is only a safety net.
 */
export const CACHE_TAGS = {
  settings: "settings",
  projects: "projects",
  experience: "experience",
  technologies: "technologies",
  testimonials: "testimonials",
  resumes: "resumes",
  medium: "medium",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

const ONE_HOUR = 3600;

// unstable_cache stores JSON, which would turn Dates into strings. Dates are
// wrapped as {"$date": "…"} on the way in and revived on the way out.
export function serialize(value: unknown) {
  return JSON.stringify(value, function (this: Record<string, unknown>, key, current) {
    return this[key] instanceof Date ? { $date: current } : current;
  });
}

export function deserialize<T>(json: string): T {
  return JSON.parse(json, (_key, value) =>
    value && typeof value === "object" && typeof value.$date === "string"
      ? new Date(value.$date)
      : value,
  );
}

/**
 * A public query served from Next's data cache, so pages (and dev-mode
 * renders, where ISR doesn't apply) don't wait on the database every time.
 * Also deduplicated within one render via React `cache()`.
 */
export function cachedQuery<Args extends unknown[], Result>(
  key: string,
  tags: CacheTag[],
  query: (...args: Args) => Promise<Result>,
) {
  const stored = unstable_cache(async (...args: Args) => serialize(await query(...args)), [key], {
    tags,
    revalidate: ONE_HOUR,
  });
  return cache(
    async (...args: Args): Promise<Result> => deserialize<Result>(await stored(...args)),
  );
}
