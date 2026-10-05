import { NextResponse } from "next/server";
import { clientEnv } from "@/shared/configs/clientEnv";
import { getMediumSyncStatus } from "@/features/medium/queries/mediumQueries";

// Posts now live on Medium: existing RSS subscribers are sent to the Medium feed.
export async function GET() {
  const { feedUrl } = await getMediumSyncStatus();
  return NextResponse.redirect(feedUrl ?? `${clientEnv.siteUrl}/blog`, 308);
}
