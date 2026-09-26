import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { getServerEnv } from "@/shared/configs/env";

// Best-effort client IP (Vercel sets x-forwarded-for). Only ever used hashed,
// as a rate-limit key — never stored.
export async function getClientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export const hashValue = (value: string) =>
  createHash("sha256").update(`${value}:${getServerEnv().HASH_SALT}`).digest("hex");
