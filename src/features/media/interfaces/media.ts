// A stored Cloudinary file as passed to forms and components. Forms save the
// `id`; only MediaAsset knows the Cloudinary `publicId`.
export type MediaRef = {
  id: string;
  publicId: string;
  resourceType: string;
  format: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
  alt: string | null;
};

// What Cloudinary returns from a direct upload (the fields we use).
export type CloudinaryUploadResult = {
  public_id: string;
  version: number;
  signature: string;
  resource_type: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
};

export const MEDIA_FOLDERS = [
  "projects",
  "avatars",
  "technologies",
  "experience",
  "resumes",
  "site",
] as const;

export type MediaFolder = (typeof MEDIA_FOLDERS)[number];
