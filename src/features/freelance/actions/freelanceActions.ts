"use server";

import { z } from "zod";
import { requireAdmin } from "@/shared/libs/authGuard";
import { fail, ok, validationFail, type ActionResult } from "@/shared/libs/actionResult";
import { toErrorMessage } from "@/shared/libs/errors";
import { revalidateSite } from "@/shared/libs/revalidate";
import {
  freelanceOfferSchema,
  freelanceServiceSchema,
  freelanceSettingsSchema,
  type FreelanceOfferInput,
  type FreelanceServiceInput,
  type FreelanceSettingsInput,
} from "../schemas/freelanceSchema";
import { freelanceServices } from "../services/freelanceServices";

// Every change refreshes the cached /freelance page.
async function run(task: () => Promise<unknown>): Promise<ActionResult> {
  try {
    await task();
    revalidateSite.freelance();
    return ok();
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

const idsSchema = z.array(z.string());

const visibilitySchema = z.object({
  kind: z.enum(["service", "offer"]),
  id: z.string().min(1),
  visible: z.boolean(),
});

/** Show or hide one service or offer (only that field changes). */
export async function setFreelanceItemVisible(
  kind: "service" | "offer",
  id: string,
  visible: boolean,
) {
  await requireAdmin();
  const parsed = visibilitySchema.safeParse({ kind, id, visible });
  if (!parsed.success) return validationFail(parsed.error);
  return run(() => freelanceServices.setVisible(parsed.data.kind, parsed.data.id, visible));
}

export async function updateFreelanceSettings(input: FreelanceSettingsInput) {
  await requireAdmin();
  const parsed = freelanceSettingsSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);
  return run(() => freelanceServices.updateSettings(parsed.data));
}

// ── Services ─────────────────────────────────────────────────────────────

export async function createFreelanceService(input: FreelanceServiceInput) {
  await requireAdmin();
  const parsed = freelanceServiceSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);
  return run(() => freelanceServices.createService(parsed.data));
}

export async function updateFreelanceService(id: string, input: FreelanceServiceInput) {
  await requireAdmin();
  const parsed = freelanceServiceSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);
  return run(() => freelanceServices.updateService(id, parsed.data));
}

export async function deleteFreelanceService(id: string) {
  await requireAdmin();
  return run(() => freelanceServices.deleteService(id));
}

export async function reorderFreelanceServices(ids: string[]) {
  await requireAdmin();
  const parsed = idsSchema.safeParse(ids);
  if (!parsed.success) return validationFail(parsed.error);
  return run(() => freelanceServices.reorderServices(parsed.data));
}

// ── Offers ───────────────────────────────────────────────────────────────

export async function createFreelanceOffer(input: FreelanceOfferInput) {
  await requireAdmin();
  const parsed = freelanceOfferSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);
  return run(() => freelanceServices.createOffer(parsed.data));
}

export async function updateFreelanceOffer(id: string, input: FreelanceOfferInput) {
  await requireAdmin();
  const parsed = freelanceOfferSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);
  return run(() => freelanceServices.updateOffer(id, parsed.data));
}

export async function deleteFreelanceOffer(id: string) {
  await requireAdmin();
  return run(() => freelanceServices.deleteOffer(id));
}

export async function reorderFreelanceOffers(ids: string[]) {
  await requireAdmin();
  const parsed = idsSchema.safeParse(ids);
  if (!parsed.success) return validationFail(parsed.error);
  return run(() => freelanceServices.reorderOffers(parsed.data));
}
