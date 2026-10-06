"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { ExternalLink } from "lucide-react";
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
import { GalleryField } from "@/features/media/components/GalleryField";
import { ImageUpload } from "@/features/media/components/ImageUpload";
import { VideoUpload } from "@/features/media/components/VideoUpload";
import type { TechnologyAdminRow } from "@/features/technologies/interfaces/technology";
import { TechnologyPicker } from "@/features/technologies/components/TechnologyPicker";
import { createProject, updateProject } from "../actions/projectActions";
import type { ProjectFormData } from "../interfaces/project";
import type { ProjectInput } from "../schemas/projectSchema";

type FormValues = Omit<ProjectFormData, "id">;

const EMPTY: FormValues = {
  title: "",
  slug: "",
  subtitle: "",
  summary: "",
  displayDate: "",
  cover: null,
  images: [],
  previewVideo: null,
  contentJson: null,
  contentHtml: "",
  liveUrl: "",
  repoUrl: "",
  featured: false,
  published: false,
  freelance: false,
  clientName: "",
  outcome: "",
  technologyIds: [],
  seoTitle: "",
  seoDescription: "",
};

type ProjectFormProps = {
  project?: ProjectFormData;
  technologies: TechnologyAdminRow[];
};

export const ProjectForm = ({ project, technologies }: ProjectFormProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<FormValues>({ defaultValues: project ?? EMPTY });
  const { register, control, handleSubmit, setError, setValue, formState, reset } = form;
  const errors = formState.errors;
  useUnsavedChangesWarning(formState.isDirty && !pending);

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const { cover, images, previewVideo, ...rest } = values;
      const input: ProjectInput = {
        ...rest,
        coverId: cover?.id ?? null,
        imageIds: images.map((m) => m.id),
        previewVideoId: previewVideo?.id ?? null,
      };
      const result = project ? await updateProject(project.id, input) : await createProject(input);

      if (!result.ok) {
        applyFieldErrors(setError, result.fieldErrors);
        toast.error(result.error);
        return;
      }
      toast.success(project ? "Project saved" : "Project created");
      reset(values); // clears the dirty flag
      router.push("/admin/projects");
      router.refresh();
    }),
  );

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex min-w-0 flex-col gap-5">
        <FormField label="Title" htmlFor="title" error={errors.title?.message}>
          <Input id="title" {...register("title")} aria-invalid={!!errors.title} />
        </FormField>

        <FormField
          label="Summary"
          htmlFor="summary"
          error={errors.summary?.message}
          hint="Shown on project cards and as the page description (10–300 characters)."
        >
          <Textarea
            id="summary"
            rows={3}
            {...register("summary")}
            aria-invalid={!!errors.summary}
          />
        </FormField>

        <FormField label="Write-up" error={errors.contentHtml?.message}>
          <RichEditor
            initialJson={project?.contentJson}
            initialHtml={project?.contentHtml}
            uploadFolder="projects"
            placeholder="Overview, highlights, challenges, what you learned…"
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
            <Controller
              control={control}
              name="featured"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Featured on home page</Label>
                  <Switch id="featured" checked={field.value} onCheckedChange={field.onChange} />
                </div>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={pending} className="flex-1">
                {pending ? "Saving…" : project ? "Save" : "Create project"}
              </Button>
              {project && (
                <Button asChild variant="outline" size="icon" aria-label="View on site">
                  <Link href={`/projects/${project.slug}`} target="_blank">
                    <ExternalLink />
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Freelance page</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Controller
              control={control}
              name="freelance"
              render={({ field }) => (
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="freelance">Show in /freelance Work</Label>
                  <Switch id="freelance" checked={field.value} onCheckedChange={field.onChange} />
                </div>
              )}
            />
            <FormField
              label="Client"
              htmlFor="clientName"
              hint="Shown first in the caption. Empty uses the project title."
              error={errors.clientName?.message}
            >
              <Input id="clientName" {...register("clientName")} placeholder="Acme Health" />
            </FormField>
            <FormField
              label="Outcome"
              htmlFor="outcome"
              hint="One line about the result for the client. Empty uses the summary."
              error={errors.outcome?.message}
            >
              <Textarea id="outcome" rows={2} {...register("outcome")} />
            </FormField>
            <FormField
              label="Preview video (optional)"
              hint="A short silent screen recording (5–15 s). It loops on the Work card in place of the images."
            >
              <Controller
                control={control}
                name="previewVideo"
                render={({ field }) => (
                  <VideoUpload value={field.value} onChange={field.onChange} folder="projects" />
                )}
              />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              label="Slug"
              htmlFor="slug"
              error={errors.slug?.message}
              hint="Leave empty to generate from the title."
            >
              <Input id="slug" {...register("slug")} placeholder="my-project" />
            </FormField>
            <FormField label="Subtitle" htmlFor="subtitle" error={errors.subtitle?.message}>
              <Input id="subtitle" {...register("subtitle")} placeholder="Platform | In Progress" />
            </FormField>
            <FormField label="Date shown" htmlFor="displayDate" hint='e.g. "July 2026"'>
              <Input id="displayDate" {...register("displayDate")} />
            </FormField>
            <FormField label="Live URL" htmlFor="liveUrl" error={errors.liveUrl?.message}>
              <Input id="liveUrl" type="url" {...register("liveUrl")} placeholder="https://" />
            </FormField>
            <FormField label="Repository URL" htmlFor="repoUrl" error={errors.repoUrl?.message}>
              <Input id="repoUrl" type="url" {...register("repoUrl")} placeholder="https://" />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField label="Cover (project cards)">
              <Controller
                control={control}
                name="cover"
                render={({ field }) => (
                  <ImageUpload value={field.value} onChange={field.onChange} folder="projects" />
                )}
              />
            </FormField>
            <FormField label="Gallery (detail page)" error={errors.images?.message}>
              <Controller
                control={control}
                name="images"
                render={({ field }) => (
                  <GalleryField value={field.value} onChange={field.onChange} folder="projects" />
                )}
              />
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

        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              label="SEO title"
              htmlFor="seoTitle"
              error={errors.seoTitle?.message}
              hint="Defaults to the title (≤ 70)."
            >
              <Input id="seoTitle" {...register("seoTitle")} />
            </FormField>
            <FormField
              label="SEO description"
              htmlFor="seoDescription"
              error={errors.seoDescription?.message}
              hint="Defaults to the summary (≤ 160)."
            >
              <Textarea id="seoDescription" rows={2} {...register("seoDescription")} />
            </FormField>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};
