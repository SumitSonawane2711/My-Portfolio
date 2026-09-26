import type { NextRequest } from "next/server";
import { resumeRepository } from "@/features/resume/repositories/resumeRepository";
import { serveResumeDownload } from "@/features/resume/services/resumeDownload";

// Counted download of one resume (ACTIVE or UNLISTED).
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return serveResumeDownload(request, await resumeRepository.findPublicBySlug(slug));
}
