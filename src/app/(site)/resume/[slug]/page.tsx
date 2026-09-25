import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResumePage } from "@/features/resume/components/ResumePage";
import { getActiveResumes, getPublicResume } from "@/features/resume/queries/resumeQueries";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

// Active resumes are prebuilt; unlisted ones render on first visit.
export async function generateStaticParams() {
  return (await getActiveResumes()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resume = await getPublicResume(slug);
  if (!resume) return { title: "Resume not found" };
  return {
    title: `${resume.title} - Resume`,
    // Unlisted resumes are shared by link only — keep them out of search engines.
    robots: resume.status === "UNLISTED" ? { index: false, follow: false } : undefined,
  };
}

export default async function ResumeBySlug({ params }: PageProps) {
  const { slug } = await params;
  const resume = await getPublicResume(slug);
  if (!resume) notFound();

  // An unlisted resume is shown on its own, without the switcher to the others.
  const options = resume.status === "ACTIVE" ? await getActiveResumes() : [resume];
  return <ResumePage resume={resume} options={options} />;
}
