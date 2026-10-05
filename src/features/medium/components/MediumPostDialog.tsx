"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { applyFieldErrors } from "@/shared/libs/form";
import { FormField } from "@/features/admin/components/FormField";
import { addMediumPost, updateMediumPost } from "../actions/mediumActions";
import type { MediumPostAdminRow } from "../interfaces/medium";

type FormValues = {
  url: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  publishedAt: string;
  tags: string;
};

const EMPTY: FormValues = {
  url: "",
  title: "",
  excerpt: "",
  coverUrl: "",
  publishedAt: "",
  tags: "",
};

const toValues = (post: MediumPostAdminRow): FormValues => ({
  url: post.url,
  title: post.title,
  excerpt: post.excerpt,
  coverUrl: post.coverUrl ?? "",
  publishedAt: post.publishedAt.toISOString().slice(0, 10),
  tags: post.tags.join(", "),
});

type MediumPostDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** A hand-added story to edit; omit to add one. */
  post?: MediumPostAdminRow | null;
};

// Medium blocks automated page reads, so a hand-added story's details are typed in.
export const MediumPostDialog = ({ open, onOpenChange, post }: MediumPostDialogProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, setError, formState } = useForm<FormValues>({
    values: post ? toValues(post) : EMPTY,
  });
  const errors = formState.errors;

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const input = {
        ...values,
        tags: values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };
      const result = post ? await updateMediumPost(post.id, input) : await addMediumPost(input);
      if (!result.ok) {
        applyFieldErrors(setError, result.fieldErrors);
        toast.error(result.error);
        return;
      }
      toast.success(post ? "Story saved" : "Story added");
      onOpenChange(false);
      router.refresh();
    }),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{post ? "Edit story" : "Add a story"}</DialogTitle>
          <DialogDescription>
            For stories older than your Medium feed&apos;s latest 10. Newer ones sync on their own.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <FormField label="Story URL" htmlFor="url" error={errors.url?.message}>
            <Input
              id="url"
              type="url"
              placeholder="https://medium.com/@you/story-title-1a2b3c4d5e6f"
              {...register("url")}
            />
          </FormField>
          <FormField label="Title" htmlFor="title" error={errors.title?.message}>
            <Input id="title" {...register("title")} />
          </FormField>
          <FormField
            label="Excerpt"
            htmlFor="excerpt"
            hint="One or two sentences shown on the card."
            error={errors.excerpt?.message}
          >
            <Textarea id="excerpt" rows={3} {...register("excerpt")} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Published on"
              htmlFor="publishedAt"
              error={errors.publishedAt?.message}
            >
              <Input id="publishedAt" type="date" {...register("publishedAt")} />
            </FormField>
            <FormField
              label="Tags"
              htmlFor="tags"
              hint="Comma separated"
              error={errors.tags?.message}
            >
              <Input id="tags" placeholder="nextjs, react" {...register("tags")} />
            </FormField>
          </div>
          <FormField
            label="Cover image URL"
            htmlFor="coverUrl"
            hint="Optional. Right-click the story's image on Medium → Copy image address."
            error={errors.coverUrl?.message}
          >
            <Input id="coverUrl" type="url" {...register("coverUrl")} />
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {post ? "Save" : "Add story"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
