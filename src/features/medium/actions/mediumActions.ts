"use server";

import { z } from "zod";
import { requireAdmin } from "@/shared/libs/authGuard";
import { fail, ok, validationFail, type ActionResult } from "@/shared/libs/actionResult";
import { toErrorMessage } from "@/shared/libs/errors";
import { revalidateSite } from "@/shared/libs/revalidate";
import { mediumPostSchema, type MediumPostInput } from "../schemas/mediumSchema";
import { mediumServices } from "../services/mediumServices";

export async function syncMediumNow(): Promise<ActionResult<{ total: number; added: number }>> {
  await requireAdmin();
  try {
    const result = await mediumServices.sync();
    revalidateSite.blog();
    return ok(result);
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

export async function addMediumPost(input: MediumPostInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = mediumPostSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);
  try {
    await mediumServices.addManual(parsed.data);
    revalidateSite.blog();
    return ok();
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

export async function updateMediumPost(id: string, input: MediumPostInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = mediumPostSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);
  try {
    await mediumServices.updateManual(id, parsed.data);
    revalidateSite.blog();
    return ok();
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

export async function deleteMediumPost(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await mediumServices.delete(id);
    revalidateSite.blog();
    return ok();
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

const flagSchema = z.object({ field: z.enum(["hidden", "featured"]), value: z.boolean() });

export async function setMediumPostFlag(
  id: string,
  field: "hidden" | "featured",
  value: boolean,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = flagSchema.safeParse({ field, value });
  if (!parsed.success) return validationFail(parsed.error);
  try {
    if (parsed.data.field === "hidden") await mediumServices.setHidden(id, parsed.data.value);
    else await mediumServices.setFeatured(id, parsed.data.value);
    revalidateSite.blog();
    return ok();
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}
