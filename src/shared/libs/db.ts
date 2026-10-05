import { PrismaPg } from "@prisma/adapter-pg";
// Relative on purpose: the Better Auth CLI and scripts/* load this file
// outside Next.js, where the "@/..." alias may not resolve.
// eslint-disable-next-line no-restricted-imports
import { PrismaClient } from "../../generated/prisma/client";

// Keyed by adapter so a dev server that cached the old Neon client picks this one up.
const globalForPrisma = globalThis as unknown as { prismaPg?: PrismaClient };

// Neon's pooled URL over plain TCP (node-postgres). The app runs on Node —
// locally and on Vercel — so no WebSocket driver is needed, and pg fails fast
// with a readable error instead of hanging on a dropped WebSocket.
function createPrismaClient() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL is not set");

  // TLS is verified explicitly below; dropping `sslmode` from the URL avoids
  // pg's deprecation warning about how it will interpret that parameter.
  const url = new URL(raw);
  url.searchParams.delete("sslmode");

  const adapter = new PrismaPg({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: true },
    max: 5,
    // Opening a TLS connection to Neon can take several seconds on a slow
    // network; 10 s made pages fail with "connection timeout".
    connectionTimeoutMillis: 30_000,
    // Reuse warm connections instead of reconnecting after a short pause.
    // Below Neon's 5-minute auto-suspend, so pooled connections aren't dropped.
    idleTimeoutMillis: 240_000,
    keepAlive: true,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

// One client per process; the global cache avoids "too many clients" during
// dev hot reloads.
export const db = globalForPrisma.prismaPg ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaPg = db;
