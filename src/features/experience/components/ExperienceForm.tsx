"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import { RichEditor } from "@/shared/components/editor/RichEditor";
import { useUnsavedChangesWarning } from "@/shared/hooks/useUnsavedChangesWarning";
import { applyFieldErrors } from "@/shared/libs/form";
import { FormField } from "@/features/admin/components/FormField";
import type { TechnologyAdminRow } from "@/features/technologies/interfaces/technology";
import { TechnologyPicker } from "@/features/technologies/components/TechnologyPicker";
import { createExperience, updateExperience } from "../actions/experienceActions";
import type { ExperienceFormData } from "../interfaces/experience";

type FormValues = Omit<ExperienceFormData, "id"> & { current: boolean };

type ExperienceFormProps = {
  experience?: ExperienceFormData;
  technologies: TechnologyAdminRow[];
};

export const ExperienceForm = ({ experience, technologies }: ExperienceFormProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<FormValues>({
    defaultValues: experience
      ? { ...experience, current: experience.endMonth === "" }
      : {
          company: "",
          slug: "",
          role: "",
          companyUrl: "",
          location: "",
          startMonth: "",
          endMonth: "",
          current: true,
          summary: "",
          contentJson: null,
          contentHtml: "",
          published: true,
          technologyIds: [],
        },
  });
  const { register, control, handleSubmit, setError, setValue, formState, reset } = form;
  const errors = formState.errors;
  const current = useWatch({ control, name: "current" });
  useUnsavedChangesWarning(formState.isDirty && !pending);

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const { current: isCurrent, ...rest } = values;
      const input = { ...rest, endMonth: isCurrent ? "" : rest.endMonth };
      const result = experience
        ? await updateExperience(experience.id, input)
        : await createExperience(input);
      if (!result.ok) {
        applyFieldErrors(setError, result.fieldErrors);
        toast.error(result.error);
        return;
      }
      toast.success(experience ? "Experience saved" : "Experience added");
      reset(values);
      router.push("/admin/experience");
      router.refresh();
    }),
  );

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex min-w-0 flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Company" htmlFor="company" error={errors.company?.message}>
            <Input id="company" {...register("company")} />
          </FormField>
          <FormField label="Role" htmlFor="role" error={errors.role?.message}>
            <Input id="role" {...register("role")} />
          </FormField>
        </div>
        <FormField
          label="Summary"
          htmlFor="summary"
          error={errors.summary?.message}
          hint="Shown on the home page card."
        >
          <Textarea id="summary" rows={4} {...register("summary")} />
        </FormField>
        <FormField
          label="Write-up (optional)"
          hint="When filled in, the card gets a “Read more” link to a detail page."
        >
          <RichEditor
            initialJson={experience?.contentJson}
            initialHtml={experience?.contentHtml}
            uploadFolder="experience"
            onChange={({ json, html }) => {
              setValue("contentJson", json, { shouldDirty: true });
              setValue("contentHtml", html, { shouldDirty: true });
            }}
          />
        </FormField>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="flex flex-col gap-4">
            <Controller
              control={control}
              name="published"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <Label htmlFor="published">Published</Label>
                  <Switch id="published" checked={field.value} onCheckedChange={field.onChange} />
                </div>
              )}
            />
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : experience ? "Save" : "Add experience"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dates</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField label="Start" htmlFor="startMonth" error={errors.startMonth?.message}>
              <Input id="startMonth" type="month" {...register("startMonth")} />
            </FormField>
            <Controller
              control={control}
              name="current"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <Label htmlFor="current">I currently work here</Label>
                  <Switch id="current" checked={field.value} onCheckedChange={field.onChange} />
                </div>
              )}
            />
            {!current && (
              <FormField label="End" htmlFor="endMonth" error={errors.endMonth?.message}>
                <Input id="endMonth" type="month" {...register("endMonth")} />
              </FormField>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              label="Company website"
              htmlFor="companyUrl"
              error={errors.companyUrl?.message}
            >
              <Input
                id="companyUrl"
                type="url"
                placeholder="https://"
                {...register("companyUrl")}
              />
            </FormField>
            <FormField label="Location" htmlFor="location">
              <Input id="location" {...register("location")} placeholder="Pune, India · Remote" />
            </FormField>
            <FormField
              label="Slug"
              htmlFor="slug"
              error={errors.slug?.message}
              hint="Leave empty to generate from the company."
            >
              <Input id="slug" {...register("slug")} />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technologies</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="technologyIds"
              render={({ field }) => (
                <TechnologyPicker
                  options={technologies}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </CardContent>
        </Card>
      </div>
    </form>
  );
};
