import { ProjectsPage } from "@/features/projects/components/ProjectsPage";
import { getAllProjects } from "@/features/projects/queries/projectQueries";

// Static, refreshed hourly and immediately after admin saves (revalidatePath).
export const revalidate = 3600;

export default async function Projects() {
  return <ProjectsPage projects={await getAllProjects()} />;
}
