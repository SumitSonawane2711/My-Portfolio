import "server-only";
import {
  destroyAsset,
  UPLOAD_KINDS,
  verifyUploadResponse,
  type UploadKind,
} from "@/shared/libs/cloudinary";
import { AppError } from "@/shared/libs/errors";
import type { CloudinaryUploadResult, MediaRef } from "../interfaces/media";
import { mediaRepository } from "../repositories/mediaRepository";

// Abandoned uploads (a form that was never saved) are only cleaned up after
// this long, so an upload in progress is never deleted from under you.
const UNUSED_GRACE_MS = 24 * 60 * 60 * 1000;

export const mediaServices = {
  /** Verifies Cloudinary's response and records the file. */
  async register(result: CloudinaryUploadResult, kind: UploadKind): Promise<MediaRef> {
    if (!verifyUploadResponse(result.public_id, result.version, result.signature)) {
      throw new AppError("Upload could not be verified.");
    }
    const allowed = UPLOAD_KINDS[kind].allowedFormats.split(",");
    if (result.format && !allowed.includes(result.format)) {
      await destroyAsset(result.public_id, result.resource_type);
      throw new AppError(`Unsupported file type: ${result.format}.`);
    }

    return mediaRepository.upsertByPublicId({
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format ?? null,
      width: result.width ?? null,
      height: result.height ?? null,
      bytes: result.bytes ?? null,
    });
  },

  /**
   * Deletes an asset (row + Cloudinary file) if nothing references it anymore.
   * Call after an entity stops using a file (replaced cover, deleted item).
   */
  async releaseIfUnused(id: string | null | undefined) {
    if (!id) return;
    if (!(await mediaRepository.isUnused(id))) return;
    const asset = await mediaRepository.findById(id);
    if (!asset) return;
    await mediaRepository.delete(id);
    // "local" media lives in /public (not yet uploaded) — nothing to delete remotely.
    if (asset.resourceType !== "local") await destroyAsset(asset.publicId, asset.resourceType);
  },

  async releaseManyIfUnused(ids: (string | null | undefined)[]) {
    for (const id of new Set(ids)) await mediaServices.releaseIfUnused(id);
  },

  /** Deletes every unreferenced asset older than the grace period. Returns how many. */
  async cleanupUnused() {
    const unused = await mediaRepository.listUnused(new Date(Date.now() - UNUSED_GRACE_MS));
    for (const asset of unused) {
      await mediaRepository.delete(asset.id);
      if (asset.resourceType !== "local") await destroyAsset(asset.publicId, asset.resourceType);
    }
    return unused.length;
  },
};
