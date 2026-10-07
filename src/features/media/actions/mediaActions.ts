"use server";

import { z } from "zod";
import { requireAdmin } from "@/shared/libs/authGuard";
import { signUpload, type UploadKind } from "@/shared/libs/cloudinary";
import { getServerEnv } from "@/shared/configs/env";
import { fail, ok, validationFail, type ActionResult } from "@/shared/libs/actionResult";
import { toErrorMessage } from "@/shared/libs/errors";
import { revalidatePath } from "next/cache";
import { revalidateSite } from "@/shared/libs/revalidate";
import { MEDIA_FOLDERS, type MediaRef } from "../interfaces/media";
import { mediaRepository } from "../repositories/mediaRepository";
import { mediaServices } from "../services/mediaServices";

const kindSchema = z.enum(["image", "pdf", "video"]);
const folderSchema = z.enum(MEDIA_FOLDERS);

export async function getUploadSignature(folder: string, kind: UploadKind) {
  await requireAdmin();
  const parsedFolder = folderSchema.safeParse(folder);
  const parsedKind = kindSchema.safeParse(kind);
  if (!parsedFolder.success || !parsedKind.success) return fail("Invalid upload target.");

  return ok(
    signUpload(`${getServerEnv().CLOUDINARY_FOLDER}/${parsedFolder.data}`, parsedKind.data),
  );
}

const uploadResultSchema = z.object({
  public_id: z.string().min(1),
  version: z.number(),
  signature: z.string().min(1),
  resource_type: z.string(),
  format: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  bytes: z.number().optional(),
});

export async function registerUpload(
  result: unknown,
  kind: UploadKind,
): Promise<ActionResult<MediaRef>> {
  await requireAdmin();
  const parsed = uploadResultSchema.safeParse(result);
  if (!parsed.success) return validationFail(parsed.error);

  try {
    return ok(await mediaServices.register(parsed.data, kindSchema.parse(kind)));
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

/** The media library for the picker popup (images or videos). */
export async function listMediaLibrary(kind: "image" | "video"): Promise<ActionResult<MediaRef[]>> {
  await requireAdmin();
  const parsed = z.enum(["image", "video"]).safeParse(kind);
  if (!parsed.success) return fail("Invalid media type.");
  try {
    return ok(await mediaRepository.listForPicker(parsed.data));
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

export async function updateMediaAlt(id: string, alt: string): Promise<ActionResult<MediaRef>> {
  await requireAdmin();
  try {
    const media = await mediaRepository.setAlt(id, alt.trim().slice(0, 200) || null);
    revalidateSite.everything(); // alt text is shown wherever the image is
    return ok(media);
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

export async function deleteUnusedMedia(): Promise<ActionResult<{ deleted: number }>> {
  await requireAdmin();
  try {
    const deleted = await mediaServices.cleanupUnused();
    revalidatePath("/admin/media");
    return ok({ deleted });
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}
