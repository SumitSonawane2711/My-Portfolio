import "server-only";
import { cache } from "react";
import type { TechnologyAdminRow } from "../interfaces/technology";
import { technologyRepository } from "../repositories/technologyRepository";
import { toTechBadge } from "../services/technologyServices";

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
