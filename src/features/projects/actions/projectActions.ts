"use server";

import { z } from "zod";
import { requireAdmin } from "@/shared/libs/authGuard";
import { fail, ok, validationFail, type ActionResult } from "@/shared/libs/actionResult";
import { toErrorMessage } from "@/shared/libs/errors";
import { revalidateSite } from "@/shared/libs/revalidate";
import { projectSchema, type ProjectInput } from "../schemas/projectSchema";
import { projectServices } from "../services/projectServices";

export async function createProject(input: ProjectInput): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);

  try {
    const project = await projectServices.create(parsed.data);
    revalidateSite.projects([project.slug]);
    return ok({ id: project.id });
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

export async function updateProject(
  id: string,
  input: ProjectInput,
): Promise<ActionResult<{ slug: string }>> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);

  try {
    const { oldSlug, slug } = await projectServices.update(id, parsed.data);
    revalidateSite.projects([oldSlug, slug]);
    return ok({ slug });
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    const { slug } = await projectServices.delete(id);
    revalidateSite.projects([slug]);
    return ok();
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

export async function reorderProjects(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  const parsed = z.array(z.string()).safeParse(ids);
  if (!parsed.success) return validationFail(parsed.error);

  try {
    await projectServices.reorder(parsed.data);
    revalidateSite.projects();
    return ok();
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}
