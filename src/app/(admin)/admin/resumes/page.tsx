import type { Metadata } from "next";
import { requireAdmin } from "@/shared/libs/authGuard";
import { ResumesManager } from "@/features/resume/components/ResumesManager";
import { getResumesForAdmin } from "@/features/resume/queries/resumeQueries";

export const metadata: Metadata = { title: "Resumes" };

export default async function AdminResumesPage() {
  await requireAdmin();
  return <ResumesManager resumes={await getResumesForAdmin()} />;
}
