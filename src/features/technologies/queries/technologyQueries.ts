import "server-only";
import { cache } from "react";
import { CACHE_TAGS, cachedQuery } from "@/shared/libs/dataCache";
import type { TechBadge, TechnologyAdminRow } from "../interfaces/technology";
import { technologyRepository } from "../repositories/technologyRepository";
import { toTechBadge } from "../services/technologyServices";

/** Every technology, in the admin's order (the home page hero). */
export const getTechnologyBadges = cachedQuery(
  "technologies:badges",
  [CACHE_TAGS.technologies],
  async (): Promise<TechBadge[]> => (await technologyRepository.list()).map(toTechBadge),
);

export const getTechnologiesForAdmin = cache(async (): Promise<TechnologyAdminRow[]> => {
  const rows = await technologyRepository.list();
  return rows.map((row) => ({
    ...toTechBadge(row),
    id: row.id,
    icon: row.icon,
    customIcon: row.customIcon,
    usage: row._count.projects + row._count.experiences,
  }));
});
