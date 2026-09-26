import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/shared/libs/authGuard";
import { ConfirmDeleteButton } from "@/features/admin/components/ConfirmDeleteButton";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { deleteExperience } from "@/features/experience/actions/experienceActions";
import { ExperienceForm } from "@/features/experience/components/ExperienceForm";
import { getExperienceForEdit } from "@/features/experience/queries/experienceQueries";
import { getTechnologiesForAdmin } from "@/features/technologies/queries/technologyQueries";

export const metadata: Metadata = { title: "Edit experience" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExperiencePage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const [experience, technologies] = await Promise.all([
    getExperienceForEdit(id),
    getTechnologiesForAdmin(),
  ]);
  if (!experience) notFound();

  return (
    <>
      <PageHeader
        title={`${experience.company} · ${experience.role}`}
        actions={
          <ConfirmDeleteButton
            itemName={experience.company}
            onConfirm={deleteExperience.bind(null, experience.id)}
            redirectTo="/admin/experience"
          />
        }
      />
      <ExperienceForm experience={experience} technologies={technologies} />
    </>
  );
}
