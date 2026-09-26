import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResumePage } from "@/features/resume/components/ResumePage";
import { getActiveResumes, getDefaultResume } from "@/features/resume/queries/resumeQueries";

export const revalidate = 3600;

export const metadata: Metadata = { title: "Resume" };

export default async function Resume() {
  const [resume, options] = await Promise.all([getDefaultResume(), getActiveResumes()]);
  if (!resume) notFound();
  return <ResumePage resume={resume} options={options} />;
}
