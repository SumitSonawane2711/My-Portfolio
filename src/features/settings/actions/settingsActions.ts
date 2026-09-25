"use server";

import { requireAdmin } from "@/shared/libs/authGuard";
import { fail, ok, validationFail, type ActionResult } from "@/shared/libs/actionResult";
import { toErrorMessage } from "@/shared/libs/errors";
import { revalidateSite } from "@/shared/libs/revalidate";
import { settingsSchema, type SettingsInput } from "../schemas/settingsSchema";
import { settingsServices } from "../services/settingsServices";

export async function updateSettings(input: SettingsInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);

  try {
    await settingsServices.update(parsed.data);
  } catch (error) {
    return fail(toErrorMessage(error));
  }
  // Name, avatar, socials and metadata appear on every page.
  revalidateSite.everything();
  return ok();
}
