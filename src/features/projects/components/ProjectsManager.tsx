"use client";

import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { CloudImage } from "@/shared/components/CloudImage";
import { ConfirmDeleteButton } from "@/features/admin/components/ConfirmDeleteButton";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { SortableList } from "@/features/admin/components/SortableList";
import { deleteProject, reorderProjects } from "../actions/projectActions";
import type { ProjectAdminRow } from "../interfaces/project";

export const ProjectsManager = ({ projects }: { projects: ProjectAdminRow[] }) => {
  return (
    <>
      <PageHeader
        title="Projects"
        description="Drag to set the order on the site. Featured projects show first on the home page."
        actions={
          <Button asChild>
            <Link href="/admin/projects/new">
              <Plus />
              New project
            </Link>
          </Button>
        }
      />

      <SortableList
        items={projects}
        onReorder={reorderProjects}
        empty={<p className="text-sm text-muted-foreground">No projects yet.</p>}
        renderItem={(project) => (
          <>
            <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded border bg-muted">
              {project.coverPublicId && (
                <CloudImage
                  publicId={project.coverPublicId}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/admin/projects/${project.id}`}
                className="block truncate text-sm font-medium hover:underline"
              >
                {project.title}
              </Link>
              <p className="text-xs text-muted-foreground">{project.displayDate}</p>
            </div>
            <div className="hidden gap-1 sm:flex">
              {project.portfolio && <Badge variant="secondary">portfolio</Badge>}
              {project.freelance && <Badge variant="secondary">freelance</Badge>}
              {project.featured && <Badge variant="secondary">featured</Badge>}
              <Badge variant={project.published ? "success" : "outline"}>
                {project.published ? "published" : "draft"}
              </Badge>
            </div>
            <Button asChild variant="ghost" size="icon" aria-label={`Edit ${project.title}`}>
              <Link href={`/admin/projects/${project.id}`}>
                <Pencil />
              </Link>
            </Button>
            <ConfirmDeleteButton
              itemName={project.title}
              onConfirm={deleteProject.bind(null, project.id)}
            />
          </>
        )}
      />
    </>
  );
};
