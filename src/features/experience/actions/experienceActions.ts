"use server";

import { requireAdmin } from "@/shared/libs/authGuard";
import { fail, ok, validationFail, type ActionResult } from "@/shared/libs/actionResult";
import { toErrorMessage } from "@/shared/libs/errors";
import { revalidateSite } from "@/shared/libs/revalidate";
import { experienceSchema, type ExperienceInput } from "../schemas/experienceSchema";
import { experienceServices } from "../services/experienceServices";

export async function createExperience(input: ExperienceInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);
  try {
    const { slug } = await experienceServices.create(parsed.data);
    revalidateSite.experience([slug]);
    revalidateSite.everything(); // years of experience appears in the profile card
    return ok();
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

export async function updateExperience(id: string, input: ExperienceInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);
  try {
    const { oldSlug, slug } = await experienceServices.update(id, parsed.data);
    revalidateSite.experience([oldSlug, slug]);
    revalidateSite.everything();
    return ok();
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    const { slug } = await experienceServices.delete(id);
    revalidateSite.experience([slug]);
    revalidateSite.everything();
    return ok();
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}
