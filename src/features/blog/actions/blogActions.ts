"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/shared/libs/authGuard";
import { fail, ok, validationFail, type ActionResult } from "@/shared/libs/actionResult";
import { toErrorMessage } from "@/shared/libs/errors";
import { revalidateSite } from "@/shared/libs/revalidate";
import {
  autosaveSchema,
  postSchema,
  type AutosaveInput,
  type PostInput,
} from "../schemas/blogSchema";
import { blogServices } from "../services/blogServices";

export async function createDraft() {
  await requireAdmin();
  const post = await blogServices.createDraft();
  redirect(`/admin/blog/${post.id}`);
}

export async function savePost(
  id: string,
  input: PostInput,
): Promise<ActionResult<{ slug: string; status: string }>> {
  await requireAdmin();
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);

  try {
    const result = await blogServices.save(id, parsed.data);
    // Revalidate when the post is (or was) visible, and for scheduled posts
    // so the list pages pick them up on time.
    if (result.wasVisible || result.isVisible || result.status === "SCHEDULED") {
      revalidateSite.blog([result.oldSlug, result.slug]);
    }
    return ok({ slug: result.slug, status: result.status });
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

export async function autosavePost(
  id: string,
  input: AutosaveInput,
): Promise<ActionResult<{ savedAt: string }>> {
  await requireAdmin();
  const parsed = autosaveSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);

  try {
    const result = await blogServices.autosave(id, parsed.data);
    // Drafts aren't public, so only published posts need their pages refreshed.
    if (result.isVisible) revalidateSite.blog([result.slug]);
    return ok({ savedAt: new Date().toISOString() });
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

export async function unpublishPost(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    const { slug } = await blogServices.unpublish(id);
    revalidateSite.blog([slug]);
    return ok();
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

export async function deletePost(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    const { slug } = await blogServices.delete(id);
    revalidateSite.blog([slug]);
    return ok();
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}
