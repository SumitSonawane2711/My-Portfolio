"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import { FormField } from "@/features/admin/components/FormField";
import { ImageUpload } from "@/features/media/components/ImageUpload";
import { createTestimonial, updateTestimonial } from "../actions/testimonialActions";
import type { TestimonialAdminRow } from "../interfaces/testimonial";

type FormValues = Omit<TestimonialAdminRow, "id">;

const EMPTY: FormValues = {
  name: "",
  role: "",
  company: "",
  quote: "",
  linkedinUrl: "",
  sourceNote: "",
  visible: true,
  freelance: false,
  avatar: null,
};

type TestimonialDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial?: TestimonialAdminRow | null;
};

export const TestimonialDialog = ({ open, onOpenChange, testimonial }: TestimonialDialogProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { register, control, handleSubmit, setError, formState } = useForm<FormValues>({
    values: testimonial ?? EMPTY,
  });
  const errors = formState.errors;
  const quote = useWatch({ control, name: "quote" }) ?? "";

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const { avatar, ...rest } = values;
      const input = { ...rest, avatarId: avatar?.id ?? null };
      const result = testimonial
        ? await updateTestimonial(testimonial.id, input)
        : await createTestimonial(input);
      if (!result.ok) {
        applyFieldErrors(setError, result.fieldErrors);
        toast.error(result.error);
        return;
      }
      toast.success(testimonial ? "Testimonial saved" : "Testimonial added");
      onOpenChange(false);
      router.refresh();
    }),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{testimonial ? "Edit testimonial" : "Add testimonial"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-[96px_1fr] gap-4">
            <Controller
              control={control}
              name="avatar"
              render={({ field }) => (
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  folder="avatars"
                  aspect="square"
                  withAlt={false}
                />
              )}
            />
            <div className="flex flex-col gap-3">
              <FormField label="Name" htmlFor="t-name" error={errors.name?.message}>
                <Input id="t-name" {...register("name")} />
              </FormField>
              <div className="grid grid-cols-2 gap-2">
                <Input aria-label="Role" placeholder="Role" {...register("role")} />
                <Input aria-label="Company" placeholder="Company" {...register("company")} />
              </div>
            </div>
          </div>
          <FormField
            label="Quote"
            htmlFor="t-quote"
            error={errors.quote?.message}
            hint={`${quote.length} / 600`}
          >
            <Textarea id="t-quote" rows={4} maxLength={600} {...register("quote")} />
          </FormField>
          <FormField label="LinkedIn URL" htmlFor="t-linkedin" error={errors.linkedinUrl?.message}>
            <Input id="t-linkedin" type="url" placeholder="https://" {...register("linkedinUrl")} />
          </FormField>
          <FormField
            label="Private source note"
            htmlFor="t-source"
            hint="Where and when you received it, with their permission. Never shown publicly."
          >
            <Input id="t-source" {...register("sourceNote")} />
          </FormField>
          <Controller
            control={control}
            name="visible"
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <Switch id="t-visible" checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor="t-visible">Visible on the site</Label>
              </div>
            )}
          />
          <Controller
            control={control}
            name="freelance"
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <Switch id="t-freelance" checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor="t-freelance">Also show on /freelance</Label>
              </div>
            )}
          />
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
