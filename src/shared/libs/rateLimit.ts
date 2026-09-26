import "server-only";
import { db } from "./db";

type RateLimitResult = { ok: boolean; remaining: number; resetAt: Date };

// Fixed-window limiter backed by the RateLimit table. One atomic statement:
// starts a fresh window when the old one has expired, otherwise increments.
export async function rateLimit(
  key: string,
  limit: number,
  windowSec: number,
): Promise<RateLimitResult> {
  const now = new Date();
  const nextReset = new Date(now.getTime() + windowSec * 1000);

  const [row] = await db.$queryRaw<{ count: number; resetAt: Date }[]>`
    INSERT INTO "RateLimit" ("key", "count", "resetAt")
    VALUES (${key}, 1, ${nextReset})
    ON CONFLICT ("key") DO UPDATE SET
      "count"   = CASE WHEN "RateLimit"."resetAt" <= ${now} THEN 1 ELSE "RateLimit"."count" + 1 END,
      "resetAt" = CASE WHEN "RateLimit"."resetAt" <= ${now} THEN ${nextReset} ELSE "RateLimit"."resetAt" END
    RETURNING "count", "resetAt"`;

  // Occasionally clear expired windows so the table stays small.
  if (Math.random() < 0.02) {
    void db.rateLimit.deleteMany({ where: { resetAt: { lt: now } } }).catch(() => {});
  }

  return {
    ok: row.count <= limit,
    remaining: Math.max(0, limit - row.count),
    resetAt: row.resetAt,
  };
}
