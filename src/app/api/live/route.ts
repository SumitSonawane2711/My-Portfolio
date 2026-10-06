import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { z } from "zod";
import { hashValue } from "@/shared/libs/request";
import { liveVisitorRepository } from "@/features/analytics/repositories/liveVisitorRepository";

// Heartbeats from LiveVisitorBeacon: "I'm on this site" every 30 s while the
// tab is visible, and "I left" when it's hidden or closed.
const bodySchema = z.object({
  site: z.enum(["PORTFOLIO", "FREELANCE"]),
  left: z.boolean().optional(),
});

const BOTS = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|curl|wget/i;

export async function POST(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") ?? "";
  // Bots, and you while signed in to the dashboard, aren't counted.
  if (!userAgent || BOTS.test(userAgent) || getSessionCookie(request)) {
    return new NextResponse(null, { status: 204 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const { site, left } = parsed.data;

  // Same person, browser and site → same id. Salted hash: nothing personal is stored.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const id = hashValue(`live:${site}:${ip}:${userAgent}`);

  try {
    if (left) await liveVisitorRepository.left(id);
    else await liveVisitorRepository.seen(id, site);
  } catch (error) {
    console.error("Live visitor heartbeat failed:", error);
  }
  return new NextResponse(null, { status: 204 });
}
