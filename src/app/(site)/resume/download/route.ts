import type { NextRequest } from "next/server";
import { resumeRepository } from "@/features/resume/repositories/resumeRepository";
import { serveResumeDownload } from "@/features/resume/services/resumeDownload";

// Counted download of the primary resume. Stable link for the old
// /CV_Sumit_Sonawane_2026.pdf URL (redirected here in next.config.ts).
export async function GET(request: NextRequest) {
  return serveResumeDownload(request, await resumeRepository.findDefault());
}
