import "server-only";
import { db } from "@/shared/libs/db";
import type { VisitorSite } from "@/generated/prisma/client";

/** A visitor counts as live for this long after their last heartbeat. */
export const LIVE_WINDOW_MS = 70 * 1000;

export const liveVisitorRepository = {
  seen(id: string, site: VisitorSite) {
    const now = new Date();
    return db.liveVisitor.upsert({
      where: { id },
      create: { id, site, lastSeen: now },
      update: { lastSeen: now },
      select: { id: true },
    });
  },

  left(id: string) {
    return db.liveVisitor.deleteMany({ where: { id } });
  },

  /** Live visitors per site; also clears out rows nobody has refreshed. */
  async countLive() {
    const since = new Date(Date.now() - LIVE_WINDOW_MS);
    const [groups] = await Promise.all([
      db.liveVisitor.groupBy({
        by: ["site"],
        where: { lastSeen: { gte: since } },
        _count: { _all: true },
      }),
      db.liveVisitor.deleteMany({ where: { lastSeen: { lt: since } } }),
    ]);
    const count = (site: VisitorSite) => groups.find((g) => g.site === site)?._count._all ?? 0;
    return { portfolio: count("PORTFOLIO"), freelance: count("FREELANCE") };
  },
};
