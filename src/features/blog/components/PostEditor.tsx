"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { RichEditor } from "@/shared/components/editor/RichEditor";
import { useUnsavedChangesWarning } from "@/shared/hooks/useUnsavedChangesWarning";
import { applyFieldErrors } from "@/shared/libs/form";
import { FormField } from "@/features/admin/components/FormField";
import { ImageUpload } from "@/features/media/components/ImageUpload";
import { autosavePost, savePost } from "../actions/blogActions";
import type { PostFormData } from "../interfaces/blog";
import { TagInput } from "./TagInput";

type FormValues = Omit<PostFormData, "id">;

const AUTOSAVE_MS = 3000;

// ISO ↔ the local "YYYY-MM-DDTHH:mm" value of <input type="datetime-local">.
const isoToLocalInput = (iso: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};
const localInputToIso = (local: string) => (local ? new Date(local).toISOString() : "");

const SUBMIT_LABEL = { DRAFT: "Save draft", PUBLISHED: "Publish", SCHEDULED: "Schedule" } as const;

export const PostEditor = ({
  post,
  tagSuggestions,
}: {
  post: PostFormData;
  tagSuggestions: string[];
}) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [autosave, setAutosave] = useState<{
    state: "idle" | "saving" | "saved" | "error";
    at?: string;
  }>({
    state: "idle",
  });
  const form = useForm<FormValues>({
    defaultValues: { ...post, publishedAt: isoToLocalInput(post.publishedAt) },
  });
  const { register, control, handleSubmit, setError, setValue, formState, reset } = form;
  const errors = formState.errors;
  const status = useWatch({ control, name: "status" });
  const title = useWatch({ control, name: "title" });
  const contentHtml = useWatch({ control, name: "contentHtml" });
  useUnsavedChangesWarning(formState.isDirty && !pending);

  // Autosave title + content 3 s after the last change (status is never touched).
  const [lastSaved, setLastSaved] = useState({ title: post.title, contentHtml: post.contentHtml });
  const inFlight = useRef(false);
  useEffect(() => {
    if (title === lastSaved.title && contentHtml === lastSaved.contentHtml) return;
    const timer = setTimeout(async () => {
      if (inFlight.current || pending) return;
      inFlight.current = true;
      setAutosave({ state: "saving" });
      const snapshot = { title: title || "Untitled", contentHtml };
      const result = await autosavePost(post.id, {
        title: snapshot.title,
        contentHtml: snapshot.contentHtml,
        contentJson: form.getValues("contentJson"),
      });
      inFlight.current = false;
      if (result.ok) {
        setLastSaved({ title, contentHtml });
        setAutosave({ state: "saved", at: result.data.savedAt });
      } else {
        setAutosave({ state: "error" });
      }
    }, AUTOSAVE_MS);
    return () => clearTimeout(timer);
  }, [title, contentHtml, lastSaved, pending, post.id, form]);

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const { cover, ...rest } = values;
      const result = await savePost(post.id, {
        ...rest,
        title: rest.title || "Untitled",
        coverId: cover?.id ?? null,
        publishedAt: localInputToIso(rest.publishedAt),
      });
      if (!result.ok) {
        applyFieldErrors(setError, result.fieldErrors);
        toast.error(result.error);
        return;
      }
      setLastSaved({ title: values.title, contentHtml: values.contentHtml });
      reset({
        ...values,
        slug: result.data.slug,
        status: result.data.status as FormValues["status"],
      });
      toast.success(
        result.data.status === "DRAFT"
          ? "Draft saved"
          : result.data.status === "SCHEDULED"
            ? "Post scheduled"
            : "Post published",
      );
      router.refresh();
    }),
  );

  const autosaveText =
    autosave.state === "saving"
      ? "Saving…"
      : autosave.state === "saved" && autosave.at
        ? `Saved ${new Date(autosave.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        : autosave.state === "error"
          ? "Autosave failed"
          : "";

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex min-w-0 flex-col gap-4">
        <Input
          {...register("title")}
          placeholder="Post title"
          aria-label="Title"
          aria-invalid={!!errors.title}
          className="h-12 border-none px-0 text-2xl font-semibold shadow-none focus-visible:ring-0 md:text-3xl"
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        <RichEditor
          initialJson={post.contentJson}
          initialHtml={post.contentHtml}
          uploadFolder="blog"
          placeholder="Write your post… (## for headings, ``` for code)"
          onChange={({ json, html }) => {
            setValue("contentJson", json, { shouldDirty: true });
            setValue("contentHtml", html, { shouldDirty: true });
          }}
        />
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span aria-live="polite">{autosaveText}</span>
              <Link
                href={`/admin/blog/${post.id}/preview`}
                target="_blank"
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                <Eye className="size-3.5" /> Preview
              </Link>
            </div>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <FormField label="Status">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full" aria-label="Status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              )}
            />
            {status !== "DRAFT" && (
              <FormField
                label={status === "SCHEDULED" ? "Publish at" : "Publish date"}
                htmlFor="publishedAt"
                error={errors.publishedAt?.message}
                hint={status === "PUBLISHED" ? "Leave empty to use now." : "Your local time."}
              >
                <Input id="publishedAt" type="datetime-local" {...register("publishedAt")} />
              </FormField>
            )}
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : SUBMIT_LABEL[status]}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Post details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              label="Slug"
              htmlFor="slug"
              error={errors.slug?.message}
              hint="Leave empty to generate from the title. Changing it breaks old links."
            >
              <Input id="slug" {...register("slug")} />
            </FormField>
            <FormField
              label="Excerpt"
              htmlFor="excerpt"
              error={errors.excerpt?.message}
              hint="Empty = first ~160 characters of the post."
            >
              <Textarea id="excerpt" rows={3} {...register("excerpt")} />
            </FormField>
            <FormField label="Tags" error={errors.tags?.message}>
              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <TagInput
                    value={field.value}
                    onChange={field.onChange}
                    suggestions={tagSuggestions}
                  />
                )}
              />
            </FormField>
            <FormField label="Cover image">
              <Controller
                control={control}
                name="cover"
                render={({ field }) => (
                  <ImageUpload value={field.value} onChange={field.onChange} folder="blog" />
                )}
              />
            </FormField>
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
              hint="≤ 70, defaults to the title."
            >
              <Input id="seoTitle" {...register("seoTitle")} />
            </FormField>
            <FormField
              label="SEO description"
              htmlFor="seoDescription"
              error={errors.seoDescription?.message}
              hint="≤ 160, defaults to the excerpt."
            >
              <Textarea id="seoDescription" rows={2} {...register("seoDescription")} />
            </FormField>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};
