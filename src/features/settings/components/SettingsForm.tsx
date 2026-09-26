"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Textarea } from "@/shared/components/ui/textarea";
import { SOCIAL_LABELS } from "@/shared/components/SocialIcon";
import { useUnsavedChangesWarning } from "@/shared/hooks/useUnsavedChangesWarning";
import { applyFieldErrors } from "@/shared/libs/form";
import { FormField } from "@/features/admin/components/FormField";
import { ImageUpload } from "@/features/media/components/ImageUpload";
import { updateSettings } from "../actions/settingsActions";
import type { SettingsFormData } from "../interfaces/settings";
import { SOCIAL_PLATFORMS } from "../schemas/settingsSchema";

const YEARS_HINT = "Use {years} to insert your years of experience (worked out from Experience).";

export const SettingsForm = ({ settings }: { settings: SettingsFormData }) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<SettingsFormData>({ defaultValues: settings });
  const { register, control, handleSubmit, setError, formState, reset } = form;
  const errors = formState.errors;
  const socials = useFieldArray({ control, name: "socials" });
  useUnsavedChangesWarning(formState.isDirty && !pending);

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const { avatar, ogImage, ...rest } = values;
      const result = await updateSettings({
        ...rest,
        avatarId: avatar?.id ?? null,
        ogImageId: ogImage?.id ?? null,
      });
      if (!result.ok) {
        applyFieldErrors(setError, result.fieldErrors);
        toast.error(result.error);
        return;
      }
      toast.success("Settings saved");
      reset(values);
      router.refresh();
    }),
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="hero">Hero & About</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="socials">Social links</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4 grid gap-5 md:grid-cols-[1fr_200px]">
          <div className="flex flex-col gap-5">
            <FormField label="Name" htmlFor="name" error={errors.name?.message}>
              <Input id="name" {...register("name")} />
            </FormField>
            <FormField
              label="Profile card summary"
              htmlFor="summary"
              error={errors.summary?.message}
              hint={YEARS_HINT}
            >
              <Textarea id="summary" rows={3} {...register("summary")} />
            </FormField>
            <Controller
              control={control}
              name="availableForWork"
              render={({ field }) => (
                <div className="flex items-center gap-3">
                  <Switch id="available" checked={field.value} onCheckedChange={field.onChange} />
                  <Label htmlFor="available">Open to work</Label>
                </div>
              )}
            />
          </div>
          <FormField label="Avatar">
            <Controller
              control={control}
              name="avatar"
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
        </TabsContent>

        <TabsContent value="hero" className="mt-4 flex flex-col gap-5">
          <FormField label="Hero heading" htmlFor="heroHeading" error={errors.heroHeading?.message}>
            <Input id="heroHeading" {...register("heroHeading")} />
          </FormField>
          <FormField
            label="Hero text"
            htmlFor="heroSubheading"
            error={errors.heroSubheading?.message}
            hint={YEARS_HINT}
          >
            <Textarea id="heroSubheading" rows={5} {...register("heroSubheading")} />
          </FormField>
          <FormField label="About (about page)" htmlFor="about" error={errors.about?.message}>
            <Textarea id="about" rows={8} {...register("about")} />
          </FormField>
        </TabsContent>

        <TabsContent value="seo" className="mt-4 grid gap-5 md:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-5">
            <FormField
              label="Site title"
              htmlFor="siteTitle"
              error={errors.siteTitle?.message}
              hint="Browser tab and search results (≤ 70)."
            >
              <Input id="siteTitle" {...register("siteTitle")} />
            </FormField>
            <FormField
              label="Site description"
              htmlFor="siteDescription"
              error={errors.siteDescription?.message}
              hint="Search result snippet (≤ 160)."
            >
              <Textarea id="siteDescription" rows={3} {...register("siteDescription")} />
            </FormField>
          </div>
          <FormField label="Default social image (1200×630)">
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
        </TabsContent>

        <TabsContent value="contact" className="mt-4 grid gap-5 sm:grid-cols-2">
          <FormField
            label="Contact email"
            htmlFor="contactEmail"
            error={errors.contactEmail?.message}
          >
            <Input id="contactEmail" type="email" {...register("contactEmail")} />
          </FormField>
          <FormField
            label="Phone"
            htmlFor="phone"
            hint="Shown as a call button on the profile card."
          >
            <Input id="phone" {...register("phone")} />
          </FormField>
          <FormField label="Location" htmlFor="location">
            <Input id="location" {...register("location")} />
          </FormField>
        </TabsContent>

        <TabsContent value="socials" className="mt-4 flex flex-col gap-3">
          {socials.fields.map((field, index) => (
            <div key={field.id} className="flex flex-wrap items-start gap-2">
              <Controller
                control={control}
                name={`socials.${index}.platform`}
                render={({ field: platform }) => (
                  <Select value={platform.value} onValueChange={platform.onChange}>
                    <SelectTrigger className="w-36" aria-label="Platform">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SOCIAL_PLATFORMS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {SOCIAL_LABELS[p]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Input
                className="min-w-48 flex-1"
                placeholder="https://"
                aria-label="URL"
                {...register(`socials.${index}.url`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Move up"
                disabled={index === 0}
                onClick={() => socials.move(index, index - 1)}
              >
                <ArrowUp />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Move down"
                disabled={index === socials.fields.length - 1}
                onClick={() => socials.move(index, index + 1)}
              >
                <ArrowDown />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove link"
                onClick={() => socials.remove(index)}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          {socials.fields.length < 10 && (
            <Button
              type="button"
              variant="outline"
              className="self-start"
              onClick={() => socials.append({ platform: "website", url: "" })}
            >
              <Plus />
              Add link
            </Button>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </form>
  );
};
