"use server";

import { z } from "zod";
import { requireAdmin } from "@/shared/libs/authGuard";
import { fail, ok, validationFail, type ActionResult } from "@/shared/libs/actionResult";
import { toErrorMessage } from "@/shared/libs/errors";
import { revalidateSite } from "@/shared/libs/revalidate";
import { testimonialSchema, type TestimonialInput } from "../schemas/testimonialSchema";
import { testimonialServices } from "../services/testimonialServices";

async function run(task: () => Promise<unknown>): Promise<ActionResult> {
  try {
    await task();
  } catch (error) {
    return fail(toErrorMessage(error));
  }
  revalidateSite.testimonials();
  return ok();
}

export async function createTestimonial(input: TestimonialInput) {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);
  return run(() => testimonialServices.create(parsed.data));
}

export async function updateTestimonial(id: string, input: TestimonialInput) {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);
  return run(() => testimonialServices.update(id, parsed.data));
}

export async function toggleTestimonialVisibility(id: string) {
  await requireAdmin();
  return run(() => testimonialServices.toggleVisibility(id));
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  return run(() => testimonialServices.delete(id));
}

export async function reorderTestimonials(ids: string[]) {
  await requireAdmin();
  const parsed = z.array(z.string()).safeParse(ids);
  if (!parsed.success) return validationFail(parsed.error);
  return run(() => testimonialServices.reorder(parsed.data));
}
