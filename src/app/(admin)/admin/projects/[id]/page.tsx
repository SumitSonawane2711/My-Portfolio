import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/shared/libs/authGuard";
import { ConfirmDeleteButton } from "@/features/admin/components/ConfirmDeleteButton";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { deleteProject } from "@/features/projects/actions/projectActions";
import { ProjectForm } from "@/features/projects/components/ProjectForm";
import { getProjectForEdit } from "@/features/projects/queries/projectQueries";
import { getTechnologiesForAdmin } from "@/features/technologies/queries/technologyQueries";

export const metadata: Metadata = { title: "Edit project" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const [project, technologies] = await Promise.all([
    getProjectForEdit(id),
    getTechnologiesForAdmin(),
  ]);
  if (!project) notFound();

  return (
    <>
      <PageHeader
        title={project.title}
        description={`/projects/${project.slug}`}
        actions={
          <ConfirmDeleteButton
            itemName={project.title}
            onConfirm={deleteProject.bind(null, project.id)}
            redirectTo="/admin/projects"
          />
        }
      />
      <ProjectForm project={project} technologies={technologies} />
    </>
  );
}
