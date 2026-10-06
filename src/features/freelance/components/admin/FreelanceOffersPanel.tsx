"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
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
import { ConfirmDeleteButton } from "@/features/admin/components/ConfirmDeleteButton";
import { FormField } from "@/features/admin/components/FormField";
import { SortableList } from "@/features/admin/components/SortableList";
import {
  createFreelanceOffer,
  deleteFreelanceOffer,
  reorderFreelanceOffers,
  setFreelanceItemVisible,
  updateFreelanceOffer,
} from "@/features/freelance/actions/freelanceActions";
import type { FreelanceOfferAdminRow } from "@/features/freelance/interfaces/freelance";

// The deliverables list is edited as one item per line.
type Values = {
  name: string;
  badge: string;
  tagline: string;
  description: string;
  deliverables: string;
  visible: boolean;
};

const EMPTY: Values = {
  name: "",
  badge: "",
  tagline: "",
  description: "",
  deliverables: "",
  visible: true,
};

const toValues = (offer: FreelanceOfferAdminRow): Values => ({
  name: offer.name,
  badge: offer.badge ?? "",
  tagline: offer.tagline,
  description: offer.description,
  deliverables: offer.deliverables.join("\n"),
  visible: offer.visible,
});

const toInput = (values: Values) => ({
  ...values,
  deliverables: values.deliverables
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean),
});

export const FreelanceOffersPanel = ({ items }: { items: FreelanceOfferAdminRow[] }) => {
  const router = useRouter();
  const [toggling, startTransition] = useTransition();
  const [dialog, setDialog] = useState<{ open: boolean; item: FreelanceOfferAdminRow | null }>({
    open: false,
    item: null,
  });

  // Switches stay disabled until the refreshed list arrives, so a second click
  // can't act on stale data.
  const setVisible = (id: string, visible: boolean) =>
    startTransition(async () => {
      const result = await setFreelanceItemVisible("offer", id, visible);
      if (!result.ok) toast.error(result.error);
      router.refresh();
    });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          The “ways to begin” cards in the Process section. Two works best.
        </p>
        <Button onClick={() => setDialog({ open: true, item: null })}>
          <Plus />
          Add offer
        </Button>
      </div>
      <SortableList
        items={items}
        onReorder={reorderFreelanceOffers}
        empty={<p className="text-sm text-muted-foreground">No offers yet.</p>}
        renderItem={(item) => (
          <>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 truncate text-sm font-medium">
                {item.name}
                {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
              </p>
              <p className="truncate text-xs text-muted-foreground">{item.tagline}</p>
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
              aria-label={`Edit ${item.name}`}
              onClick={() => setDialog({ open: true, item })}
            >
              <Pencil />
            </Button>
            <ConfirmDeleteButton
              itemName={item.name}
              onConfirm={deleteFreelanceOffer.bind(null, item.id)}
            />
          </>
        )}
      />
      <OfferDialog
        open={dialog.open}
        item={dialog.item}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
      />
    </div>
  );
};

type OfferDialogProps = {
  open: boolean;
  item: FreelanceOfferAdminRow | null;
  onOpenChange: (open: boolean) => void;
};

const OfferDialog = ({ open, item, onOpenChange }: OfferDialogProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { register, control, handleSubmit, setError, formState } = useForm<Values>({
    values: item ? toValues(item) : EMPTY,
  });
  const errors = formState.errors;

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const input = toInput(values);
      const result = item
        ? await updateFreelanceOffer(item.id, input)
        : await createFreelanceOffer(input);
      if (!result.ok) {
        applyFieldErrors(setError, result.fieldErrors);
        toast.error(result.error);
        return;
      }
      toast.success(item ? "Offer saved" : "Offer added");
      onOpenChange(false);
      router.refresh();
    }),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Edit offer" : "Add offer"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
            <FormField label="Name" htmlFor="o-name" error={errors.name?.message}>
              <Input id="o-name" {...register("name")} placeholder="Fixed-scope project" />
            </FormField>
            <FormField
              label="Badge"
              htmlFor="o-badge"
              hint="Optional"
              error={errors.badge?.message}
            >
              <Input id="o-badge" {...register("badge")} placeholder="Most popular" />
            </FormField>
          </div>
          <FormField label="Tagline" htmlFor="o-tagline" error={errors.tagline?.message}>
            <Input id="o-tagline" {...register("tagline")} />
          </FormField>
          <FormField
            label="Description"
            htmlFor="o-description"
            hint="**bold** highlights a phrase; a blank line starts a new paragraph."
            error={errors.description?.message}
          >
            <Textarea id="o-description" rows={5} {...register("description")} />
          </FormField>
          <FormField
            label="What they will get"
            htmlFor="o-deliverables"
            hint="One item per line."
            error={errors.deliverables?.message}
          >
            <Textarea id="o-deliverables" rows={4} {...register("deliverables")} />
          </FormField>
          <Controller
            control={control}
            name="visible"
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <Switch id="o-visible" checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor="o-visible">Visible on the page</Label>
              </div>
            )}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {item ? "Save" : "Add offer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
