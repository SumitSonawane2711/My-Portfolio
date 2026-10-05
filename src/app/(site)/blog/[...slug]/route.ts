import { NextResponse } from "next/server";
import { getMediumSyncStatus } from "@/features/medium/queries/mediumQueries";

// Old on-site article URLs (/blog/<slug>, /blog/tag/<tag>) go to the Medium
// profile, where the posts live now; /blog itself still lists them.
export async function GET(request: Request) {
  const { profileUrl } = await getMediumSyncStatus();
  return NextResponse.redirect(profileUrl ?? new URL("/blog", request.url), 308);
}
