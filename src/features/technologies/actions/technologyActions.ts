"use server";

import { z } from "zod";
import { requireAdmin } from "@/shared/libs/authGuard";
import { fail, ok, validationFail, type ActionResult } from "@/shared/libs/actionResult";
import { toErrorMessage } from "@/shared/libs/errors";
import { renderIconSvg, searchIcons } from "@/shared/libs/icons";
import { revalidateSite } from "@/shared/libs/revalidate";
import { technologySchema, type TechnologyInput } from "../schemas/technologySchema";
import { technologyServices } from "../services/technologyServices";

export async function createTechnology(input: TechnologyInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = technologySchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);
  try {
    await technologyServices.create(input);
  } catch (error) {
    return fail(toErrorMessage(error));
  }
  revalidateSite.everything();
  return ok();
}

export async function updateTechnology(id: string, input: TechnologyInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = technologySchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);
  try {
    await technologyServices.update(id, input);
  } catch (error) {
    return fail(toErrorMessage(error));
  }
  revalidateSite.everything();
  return ok();
}

export async function deleteTechnology(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await technologyServices.delete(id);
  } catch (error) {
    return fail(toErrorMessage(error));
  }
  revalidateSite.everything();
  return ok();
}

export async function reorderTechnologies(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  const parsed = z.array(z.string()).safeParse(ids);
  if (!parsed.success) return validationFail(parsed.error);
  try {
    await technologyServices.reorder(parsed.data);
  } catch (error) {
    return fail(toErrorMessage(error));
  }
  revalidateSite.everything();
  return ok();
}

export async function searchIconsAction(
  query: string,
): Promise<ActionResult<{ key: string; svg: string }[]>> {
  await requireAdmin();
  const keys = searchIcons(String(query).slice(0, 40));
  return ok(
    keys.flatMap((key) => {
      const svg = renderIconSvg(key);
      return svg ? [{ key, svg }] : [];
    }),
  );
}
