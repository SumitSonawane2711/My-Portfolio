import { PrismaNeon } from "@prisma/adapter-neon";
// Relative on purpose: the Better Auth CLI and scripts/* load this file
// outside Next.js, where the "@/..." alias may not resolve.
// eslint-disable-next-line no-restricted-imports
import { PrismaClient } from "../../generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

// One client per process; the global cache avoids "too many clients" during
// dev hot reloads.
export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
