import type { Metadata } from "next";
import { requireAdmin } from "@/shared/libs/authGuard";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { ExperienceForm } from "@/features/experience/components/ExperienceForm";
import { getTechnologiesForAdmin } from "@/features/technologies/queries/technologyQueries";

export const metadata: Metadata = { title: "Add experience" };

export default async function NewExperiencePage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Add experience" />
      <ExperienceForm technologies={await getTechnologiesForAdmin()} />
    </>
  );
}
