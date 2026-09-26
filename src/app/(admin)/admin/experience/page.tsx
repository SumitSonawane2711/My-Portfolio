import type { Metadata } from "next";
import { requireAdmin } from "@/shared/libs/authGuard";
import { ExperienceManager } from "@/features/experience/components/ExperienceManager";
import { getExperiencesForAdmin } from "@/features/experience/queries/experienceQueries";

export const metadata: Metadata = { title: "Experience" };

export default async function AdminExperiencePage() {
  await requireAdmin();
  return <ExperienceManager items={await getExperiencesForAdmin()} />;
}
