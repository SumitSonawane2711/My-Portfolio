"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useUnsavedChangesWarning } from "@/shared/hooks/useUnsavedChangesWarning";
import { applyFieldErrors } from "@/shared/libs/form";
import { FormField } from "@/features/admin/components/FormField";
import { ImageUpload } from "@/features/media/components/ImageUpload";
import { updateFreelanceSettings } from "@/features/freelance/actions/freelanceActions";
import type { FreelanceSettingsFormData } from "@/features/freelance/interfaces/freelance";

const COPY_HINT = "**bold** highlights a phrase; a blank line starts a new paragraph.";

type Values = FreelanceSettingsFormData;

export const FreelanceSettingsForm = ({ settings }: { settings: Values }) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<Values>({ defaultValues: settings });
  const { register, control, handleSubmit, setError, formState, reset } = form;
  const errors = formState.errors;
  useUnsavedChangesWarning(formState.isDirty && !pending);

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const { portrait, ogImage, ...rest } = values;
      const result = await updateFreelanceSettings({
        ...rest,
        portraitId: portrait?.id ?? null,
        ogImageId: ogImage?.id ?? null,
      });
      if (!result.ok) {
        applyFieldErrors(setError, result.fieldErrors);
        toast.error(result.error);
        return;
      }
      toast.success("Freelance page saved");
      reset(values);
      router.refresh();
    }),
  );

  // Short helpers for the many text fields.
  const line = (name: keyof Values, label: string, hint?: string) => (
    <FormField label={label} htmlFor={name} hint={hint} error={errors[name]?.message}>
      <Input id={name} {...register(name)} />
    </FormField>
  );
  const block = (name: keyof Values, label: string, rows = 4, hint = COPY_HINT) => (
    <FormField label={label} htmlFor={name} hint={hint} error={errors[name]?.message}>
      <Textarea id={name} rows={rows} {...register(name)} />
    </FormField>
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Hero</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {line("greeting", "Greeting", `Shown in the accent colour, e.g. "Hi, I'm Sumit,"`)}
          {block("headline", "Headline", 2, "One clear sentence about who you help and how.")}
          {block("intro", "Intro")}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work and services</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {line("workTitle", "Work title")}
          {block("workIntro", "Work intro", 2)}
          {line("servicesTitle", "What I do: title")}
          {block("servicesIntro", "What I do: intro", 5)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1fr_200px]">
          <div className="flex flex-col gap-4">
            {line("aboutTitle", "Title")}
            {block("about", "Text", 8, `${COPY_HINT} {years} inserts your years of experience.`)}
          </div>
          <FormField label="Portrait" hint="Empty uses your avatar.">
            <Controller
              control={control}
              name="portrait"
              render={({ field }) => (
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  folder="site"
                  aspect="square"
                />
              )}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Process and contact</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {line("processTitle", "Process title")}
          {block("processIntro", "Process intro")}
          {line("offersTitle", "Ways to begin: title")}
          {line("contactTitle", "Contact title")}
          {block("contactIntro", "Contact intro", 3)}
          {line(
            "availabilityNote",
            "Availability note",
            'Next to the green dot, e.g. "Taking on new projects from November 2026"',
          )}
          {line(
            "whatsapp",
            "WhatsApp number",
            "Digits with country code (e.g. 919876543210). Empty: “Message now” opens the contact form. “Call now” uses the phone from Settings.",
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO and link preview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1fr_260px]">
          <div className="flex flex-col gap-4">
            {line("seoTitle", "Title", "Up to 70 characters. Shown in search results and tabs.")}
            {block(
              "seoDescription",
              "Description",
              3,
              "Up to 160 characters. Shown under the title in search results and previews.",
            )}
          </div>
          <FormField label="Preview image" hint="1200×630. Empty uses a generated card.">
            <Controller
              control={control}
              name="ogImage"
              render={({ field }) => (
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  folder="site"
                  aspect="wide"
                />
              )}
            />
          </FormField>
        </CardContent>
      </Card>

      <div className="sticky bottom-4 flex justify-end">
        <Button type="submit" disabled={pending} className="shadow-lg">
          {pending ? "Saving…" : "Save page"}
        </Button>
      </div>
    </form>
  );
};
