"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import { applyFieldErrors } from "@/shared/libs/form";
import { truncate } from "@/shared/libs/format";
import { ConfirmDeleteButton } from "@/features/admin/components/ConfirmDeleteButton";
import { FormField } from "@/features/admin/components/FormField";
import { SortableList } from "@/features/admin/components/SortableList";
import {
  createFreelanceService,
  deleteFreelanceService,
  reorderFreelanceServices,
  setFreelanceItemVisible,
  updateFreelanceService,
} from "@/features/freelance/actions/freelanceActions";
import type { FreelanceServiceAdminRow } from "@/features/freelance/interfaces/freelance";

type Values = Omit<FreelanceServiceAdminRow, "id">;
const EMPTY: Values = { title: "", summary: "", details: "", visible: true };

export const FreelanceServicesPanel = ({ items }: { items: FreelanceServiceAdminRow[] }) => {
  const router = useRouter();
  const [toggling, startTransition] = useTransition();
  const [dialog, setDialog] = useState<{ open: boolean; item: FreelanceServiceAdminRow | null }>({
    open: false,
    item: null,
  });

  // Switches stay disabled until the refreshed list arrives, so a second click
  // can't act on stale data.
  const setVisible = (id: string, visible: boolean) =>
    startTransition(async () => {
      const result = await setFreelanceItemVisible("service", id, visible);
      if (!result.ok) toast.error(result.error);
      router.refresh();
    });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          The numbered list in “What I do”. Drag to reorder; the first one opens by default.
        </p>
        <Button onClick={() => setDialog({ open: true, item: null })}>
          <Plus />
          Add service
        </Button>
      </div>
      <SortableList
        items={items}
        onReorder={reorderFreelanceServices}
        empty={<p className="text-sm text-muted-foreground">No services yet.</p>}
        renderItem={(item) => (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {truncate(item.summary, 100)}
              </p>
            </div>
            <Switch
              checked={item.visible}
              disabled={toggling}
              onCheckedChange={(visible) => setVisible(item.id, visible)}
              aria-label={item.visible ? "Hide" : "Show"}
            />
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Edit ${item.title}`}
              onClick={() => setDialog({ open: true, item })}
            >
              <Pencil />
            </Button>
            <ConfirmDeleteButton
              itemName={item.title}
              onConfirm={deleteFreelanceService.bind(null, item.id)}
            />
          </>
        )}
      />
      <ServiceDialog
        open={dialog.open}
        item={dialog.item}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
      />
    </div>
  );
};

type ServiceDialogProps = {
  open: boolean;
  item: FreelanceServiceAdminRow | null;
  onOpenChange: (open: boolean) => void;
};

const ServiceDialog = ({ open, item, onOpenChange }: ServiceDialogProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { register, control, handleSubmit, setError, formState } = useForm<Values>({
    values: item ?? EMPTY,
  });
  const errors = formState.errors;

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const result = item
        ? await updateFreelanceService(item.id, values)
        : await createFreelanceService(values);
      if (!result.ok) {
        applyFieldErrors(setError, result.fieldErrors);
        toast.error(result.error);
        return;
      }
      toast.success(item ? "Service saved" : "Service added");
      onOpenChange(false);
      router.refresh();
    }),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Edit service" : "Add service"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <FormField label="Title" htmlFor="s-title" error={errors.title?.message}>
            <Input id="s-title" {...register("title")} placeholder="MVP development" />
          </FormField>
          <FormField
            label="Summary"
            htmlFor="s-summary"
            hint="The first sentence, shown when the item is open."
            error={errors.summary?.message}
          >
            <Textarea id="s-summary" rows={2} {...register("summary")} />
          </FormField>
          <FormField
            label="Details"
            htmlFor="s-details"
            hint="**bold** highlights a phrase; a blank line starts a new paragraph."
            error={errors.details?.message}
          >
            <Textarea id="s-details" rows={6} {...register("details")} />
          </FormField>
          <Controller
            control={control}
            name="visible"
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <Switch id="s-visible" checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor="s-visible">Visible on the page</Label>
              </div>
            )}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {item ? "Save" : "Add service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
