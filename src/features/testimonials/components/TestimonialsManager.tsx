"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { CloudImage } from "@/shared/components/CloudImage";
import { truncate } from "@/shared/libs/format";
import { ConfirmDeleteButton } from "@/features/admin/components/ConfirmDeleteButton";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { SortableList } from "@/features/admin/components/SortableList";
import {
  deleteTestimonial,
  reorderTestimonials,
  toggleTestimonialVisibility,
} from "../actions/testimonialActions";
import type { TestimonialAdminRow } from "../interfaces/testimonial";
import { TestimonialDialog } from "./TestimonialDialog";

export const TestimonialsManager = ({ items }: { items: TestimonialAdminRow[] }) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [dialog, setDialog] = useState<{ open: boolean; item: TestimonialAdminRow | null }>({
    open: false,
    item: null,
  });

  const toggle = (id: string) =>
    startTransition(async () => {
      const result = await toggleTestimonialVisibility(id);
      if (!result.ok) toast.error(result.error);
      router.refresh();
    });

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Only publish testimonials you actually received, with permission. The home page section appears once one is visible."
        actions={
          <Button onClick={() => setDialog({ open: true, item: null })}>
            <Plus />
            Add testimonial
          </Button>
        }
      />
      <SortableList
        items={items}
        onReorder={reorderTestimonials}
        empty={<p className="text-sm text-muted-foreground">No testimonials yet.</p>}
        renderItem={(item) => (
          <>
            <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-muted">
              {item.avatar && (
                <CloudImage
                  publicId={item.avatar.publicId}
                  alt=""
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {item.name}
                {item.company && <span className="text-muted-foreground"> · {item.company}</span>}
              </p>
              <p className="truncate text-xs text-muted-foreground">{truncate(item.quote, 90)}</p>
            </div>
            <Switch
              checked={item.visible}
              onCheckedChange={() => toggle(item.id)}
              aria-label={item.visible ? "Hide" : "Show"}
            />
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Edit ${item.name}`}
              onClick={() => setDialog({ open: true, item })}
            >
              <Pencil />
            </Button>
            <ConfirmDeleteButton
              itemName={`${item.name}'s testimonial`}
              onConfirm={deleteTestimonial.bind(null, item.id)}
            />
          </>
        )}
      />
      <TestimonialDialog
        open={dialog.open}
        testimonial={dialog.item}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
      />
    </>
  );
};
