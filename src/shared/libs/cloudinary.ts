import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { getServerEnv } from "@/shared/configs/env";

let configured = false;

function sdk() {
  if (!configured) {
    const env = getServerEnv();
    cloudinary.config({
      cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }
  return cloudinary;
}

export const UPLOAD_KINDS = {
  image: { allowedFormats: "jpg,jpeg,png,webp,avif,gif,svg", maxBytes: 5 * 1024 * 1024 },
  pdf: { allowedFormats: "pdf", maxBytes: 10 * 1024 * 1024 },
} as const;

export type UploadKind = keyof typeof UPLOAD_KINDS;

/** Signs a direct browser upload. Every param sent to Cloudinary (except file/api_key) is signed. */
export function signUpload(folder: string, kind: UploadKind) {
  const env = getServerEnv();
  const timestamp = Math.round(Date.now() / 1000);
  const allowedFormats = UPLOAD_KINDS[kind].allowedFormats;
  const params = { timestamp, folder, allowed_formats: allowedFormats };
  const signature = sdk().utils.api_sign_request(params, env.CLOUDINARY_API_SECRET);

  return {
    cloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    timestamp,
    folder,
    allowedFormats,
    signature,
  };
}

/** Proves an upload response really came from Cloudinary (not forged by the browser). */
export function verifyUploadResponse(
  publicId: string,
  version: number | string,
  signature: string,
) {
  const utils = sdk().utils as unknown as {
    verify_api_response_signature: (id: string, v: number | string, s: string) => boolean;
  };
  return utils.verify_api_response_signature(publicId, version, signature);
}

/** Deletes a file. Never throws — a failed cleanup must not block a save. */
export async function destroyAsset(publicId: string, resourceType = "image") {
  try {
    await sdk().uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
  } catch (error) {
    console.error(`Cloudinary: could not delete ${publicId}`, error);
  }
}
