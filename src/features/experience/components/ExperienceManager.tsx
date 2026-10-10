import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDeleteButton } from "@/features/admin/components/ConfirmDeleteButton";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { deleteExperience } from "../actions/experienceActions";
import type { ExperienceAdminRow } from "../interfaces/experience";

// Ordered by date automatically (current roles first), so no drag handle.
export const ExperienceManager = ({ items }: { items: ExperienceAdminRow[] }) => {
  return (
    <>
      <PageHeader
        title="Experience"
        description="Shown newest first. Years of experience are worked out from the earliest start date."
        actions={
          <Button asChild>
            <Link href="/admin/experience/new">
              <Plus />
              Add experience
            </Link>
          </Button>
        }
      />
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No experience yet.</p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 px-3 py-2">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/experience/${item.id}`}
                  className="block truncate text-sm font-medium hover:underline"
                >
                  {item.company} · {item.role}
                </Link>
                <p className="text-xs text-muted-foreground">{item.period}</p>
              </div>
              <Badge variant={item.published ? "success" : "outline"}>
                {item.published ? "published" : "hidden"}
              </Badge>
              <Button asChild variant="ghost" size="icon" aria-label={`Edit ${item.company}`}>
                <Link href={`/admin/experience/${item.id}`}>
                  <Pencil />
                </Link>
              </Button>
              <ConfirmDeleteButton
                itemName={item.company}
                onConfirm={deleteExperience.bind(null, item.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
