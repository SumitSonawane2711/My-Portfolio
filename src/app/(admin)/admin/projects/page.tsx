import type { Metadata } from "next";
import { requireAdmin } from "@/shared/libs/authGuard";
import { ProjectsManager } from "@/features/projects/components/ProjectsManager";
import { getProjectsForAdmin } from "@/features/projects/queries/projectQueries";

export const metadata: Metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
  await requireAdmin();
  return <ProjectsManager projects={await getProjectsForAdmin()} />;
}
