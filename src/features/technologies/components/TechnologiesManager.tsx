"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { TechBadgeIcon } from "@/shared/components/TechBadgeIcon";
import { ConfirmDeleteButton } from "@/features/admin/components/ConfirmDeleteButton";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { SortableList } from "@/features/admin/components/SortableList";
import { deleteTechnology, reorderTechnologies } from "../actions/technologyActions";
import type { TechnologyAdminRow } from "../interfaces/technology";
import { TechnologyDialog } from "./TechnologyDialog";

export const TechnologiesManager = ({ technologies }: { technologies: TechnologyAdminRow[] }) => {
  const [dialog, setDialog] = useState<{ open: boolean; tech: TechnologyAdminRow | null }>({
    open: false,
    tech: null,
  });

  return (
    <>
      <PageHeader
        title="Technologies"
        description="Reused across projects and experience. Drag to reorder."
        actions={
          <Button onClick={() => setDialog({ open: true, tech: null })}>
            <Plus />
            Add technology
          </Button>
        }
      />

      <SortableList
        items={technologies}
        onReorder={reorderTechnologies}
        empty={<p className="text-sm text-muted-foreground">No technologies yet.</p>}
        renderItem={(tech) => (
          <>
            <TechBadgeIcon tech={tech} className="h-5 w-5" />
            <span className="flex-1 truncate text-sm font-medium">{tech.name}</span>
            <Badge variant="secondary">
              {tech.usage} use{tech.usage === 1 ? "" : "s"}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Edit ${tech.name}`}
              onClick={() => setDialog({ open: true, tech })}
            >
              <Pencil />
            </Button>
            <ConfirmDeleteButton
              itemName={tech.name}
              onConfirm={deleteTechnology.bind(null, tech.id)}
            />
          </>
        )}
      />

      <TechnologyDialog
        open={dialog.open}
        technology={dialog.tech}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
      />
    </>
  );
};
