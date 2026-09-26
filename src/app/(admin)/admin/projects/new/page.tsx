import type { Metadata } from "next";
import { requireAdmin } from "@/shared/libs/authGuard";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { ProjectForm } from "@/features/projects/components/ProjectForm";
import { getTechnologiesForAdmin } from "@/features/technologies/queries/technologyQueries";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New project" />
      <ProjectForm technologies={await getTechnologiesForAdmin()} />
    </>
  );
}
