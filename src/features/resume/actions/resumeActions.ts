"use server";

import { z } from "zod";
import { requireAdmin } from "@/shared/libs/authGuard";
import { fail, ok, validationFail, type ActionResult } from "@/shared/libs/actionResult";
import { toErrorMessage } from "@/shared/libs/errors";
import { revalidateSite } from "@/shared/libs/revalidate";
import { RESUME_STATUSES, resumeSchema, type ResumeInput } from "../schemas/resumeSchema";
import { resumeServices } from "../services/resumeServices";

// Every resume change can move the primary, which the hero/profile buttons
// and /resume use — so revalidate the resume pages plus the home page.
async function run(task: () => Promise<{ slug: string; oldSlug?: string }>): Promise<ActionResult> {
  try {
    const { slug, oldSlug } = await task();
    revalidateSite.resumes([slug, oldSlug]);
    return ok();
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

export async function createResume(input: ResumeInput) {
  await requireAdmin();
  const parsed = resumeSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);
  return run(() => resumeServices.create(parsed.data));
}

export async function updateResume(id: string, input: ResumeInput) {
  await requireAdmin();
  const parsed = resumeSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);
  return run(() => resumeServices.update(id, parsed.data));
}

export async function setPrimaryResume(id: string) {
  await requireAdmin();
  return run(() => resumeServices.setPrimary(id));
}

export async function setResumeStatus(id: string, status: string) {
  await requireAdmin();
  const parsed = z.enum(RESUME_STATUSES).safeParse(status);
  if (!parsed.success) return validationFail(parsed.error);
  return run(() => resumeServices.setStatus(id, parsed.data));
}

export async function deleteResume(id: string) {
  await requireAdmin();
  return run(() => resumeServices.delete(id));
}

export async function reorderResumes(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  const parsed = z.array(z.string()).safeParse(ids);
  if (!parsed.success) return validationFail(parsed.error);
  try {
    await resumeServices.reorder(parsed.data);
    revalidateSite.resumes();
    return ok();
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}
