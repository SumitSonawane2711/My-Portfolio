"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
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
import { applyFieldErrors } from "@/shared/libs/form";
import { ImageUpload } from "@/features/media/components/ImageUpload";
import type { MediaRef } from "@/features/media/interfaces/media";
import { createTechnology, updateTechnology } from "../actions/technologyActions";
import type { TechnologyAdminRow } from "../interfaces/technology";
import { IconPicker } from "./IconPicker";

type FormValues = {
  name: string;
  icon: string | null;
  color: string;
  customIcon: MediaRef | null;
};

type TechnologyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Edit mode when given; create mode otherwise. */
  technology?: TechnologyAdminRow | null;
};

export const TechnologyDialog = ({ open, onOpenChange, technology }: TechnologyDialogProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<FormValues>({
    values: {
      name: technology?.name ?? "",
      icon: technology?.icon ?? null,
      color: technology?.color ?? "",
      customIcon: technology?.customIcon ?? null,
    },
  });
  const { register, control, handleSubmit, setError, formState } = form;

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const input = {
        name: values.name,
        icon: values.icon,
        color: values.color,
        customIconId: values.customIcon?.id ?? null,
      };
      const result = technology
        ? await updateTechnology(technology.id, input)
        : await createTechnology(input);
      if (!result.ok) {
        applyFieldErrors(setError, result.fieldErrors);
        toast.error(result.error);
        return;
      }
      toast.success(technology ? "Technology updated" : "Technology added");
      onOpenChange(false);
      router.refresh();
    }),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{technology ? `Edit ${technology.name}` : "Add technology"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tech-name">Name</Label>
            <Input id="tech-name" {...register("name")} aria-invalid={!!formState.errors.name} />
            {formState.errors.name && (
              <p className="text-sm text-destructive">{formState.errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Icon</Label>
            <Controller
              control={control}
              name="icon"
              render={({ field }) => (
                <IconPicker
                  value={field.value}
                  onChange={field.onChange}
                  selectedSvg={technology?.svg}
                  initialQuery={technology?.name ?? ""}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tech-color">Color (tints single-color icons)</Label>
            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name="color"
                render={({ field }) => (
                  <input
                    type="color"
                    aria-label="Pick color"
                    value={field.value || "#000000"}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded-md border bg-transparent"
                  />
                )}
              />
              <Input id="tech-color" placeholder="#61DAFB" {...register("color")} />
            </div>
            {formState.errors.color && (
              <p className="text-sm text-destructive">{formState.errors.color.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Custom icon (optional, used when no icon is picked)</Label>
            <Controller
              control={control}
              name="customIcon"
              render={({ field }) => (
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  folder="technologies"
                  aspect="square"
                  withAlt={false}
                  className="w-24"
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
