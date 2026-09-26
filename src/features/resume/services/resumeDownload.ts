import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { resumeRepository, type ResumeWithFile } from "../repositories/resumeRepository";
import { downloadUrl } from "./resumeServices";

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|whatsapp|telegram/i;

/**
 * Counts a download (skipping link-preview bots) and redirects to the file.
 * Shared by /resume/download (primary) and /resume/[slug]/download.
 */
export async function serveResumeDownload(request: NextRequest, resume: ResumeWithFile | null) {
  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  if (!BOT.test(request.headers.get("user-agent") ?? "")) {
    // Counting must never block the download.
    await resumeRepository.incrementDownloads(resume.id).catch(() => {});
  }

  const target = new URL(downloadUrl(resume), request.url);
  const response = NextResponse.redirect(target, 302);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
