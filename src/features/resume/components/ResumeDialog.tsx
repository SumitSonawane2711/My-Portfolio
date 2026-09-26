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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { applyFieldErrors } from "@/shared/libs/form";
import { FormField } from "@/features/admin/components/FormField";
import { FileUpload } from "@/features/media/components/FileUpload";
import type { MediaRef } from "@/features/media/interfaces/media";
import { createResume, updateResume } from "../actions/resumeActions";
import type { ResumeAdminRow, ResumeStatus } from "../interfaces/resume";

type FormValues = {
  title: string;
  slug: string;
  description: string;
  file: MediaRef | null;
  fileName: string;
  status: ResumeStatus;
  notes: string;
};

export const STATUS_HELP: Record<ResumeStatus, string> = {
  ACTIVE: "Listed on the portfolio's resume page.",
  UNLISTED: "Only reachable at its direct link — for a CV tailored to one company.",
  ARCHIVED: "Hidden everywhere; kept for its download history.",
};

type ResumeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resume?: ResumeAdminRow | null;
};

export const ResumeDialog = ({ open, onOpenChange, resume }: ResumeDialogProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { register, control, handleSubmit, setError, setValue, getValues, formState } =
    useForm<FormValues>({
      values: resume
        ? { ...resume, file: resume.file }
        : {
            title: "",
            slug: "",
            description: "",
            file: null,
            fileName: "",
            status: "ACTIVE",
            notes: "",
          },
    });
  const errors = formState.errors;

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const { file, ...rest } = values;
      if (!file) {
        setError("file", { message: "Upload a PDF" });
        return;
      }
      const input = { ...rest, fileId: file.id };
      const result = resume ? await updateResume(resume.id, input) : await createResume(input);
      if (!result.ok) {
        applyFieldErrors(setError, result.fieldErrors);
        toast.error(result.error);
        return;
      }
      toast.success(resume ? "Resume saved" : "Resume added");
      onOpenChange(false);
      router.refresh();
    }),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{resume ? `Edit ${resume.title}` : "Add resume"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <FormField
            label="PDF"
            error={errors.file?.message}
            hint={
              resume ? "Replacing the file keeps the link, so shared URLs stay valid." : undefined
            }
          >
            <Controller
              control={control}
              name="file"
              render={({ field }) => (
                <FileUpload
                  value={field.value}
                  folder="resumes"
                  label={getValues("fileName") || undefined}
                  onChange={(media) => {
                    field.onChange(media);
                    if (!getValues("fileName")) {
                      setValue("fileName", "Resume.pdf", { shouldDirty: true });
                    }
                  }}
                />
              )}
            />
          </FormField>
          <FormField
            label="Title"
            htmlFor="r-title"
            error={errors.title?.message}
            hint='e.g. "Full-stack Developer"'
          >
            <Input id="r-title" {...register("title")} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Download file name" htmlFor="r-file" error={errors.fileName?.message}>
              <Input
                id="r-file"
                placeholder="Sumit_Sonawane_FullStack.pdf"
                {...register("fileName")}
              />
            </FormField>
            <FormField
              label="Link"
              htmlFor="r-slug"
              error={errors.slug?.message}
              hint="/resume/<link>"
            >
              <Input id="r-slug" placeholder="auto" {...register("slug")} />
            </FormField>
          </div>
          <FormField
            label="Description (optional)"
            htmlFor="r-desc"
            error={errors.description?.message}
          >
            <Input id="r-desc" {...register("description")} />
          </FormField>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <FormField label="Status" hint={STATUS_HELP[field.value]}>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full" aria-label="Status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="UNLISTED">Unlisted</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            )}
          />
          <FormField
            label="Private notes"
            htmlFor="r-notes"
            hint="Target role, who received it… never shown publicly."
          >
            <Textarea id="r-notes" rows={2} {...register("notes")} />
          </FormField>
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
