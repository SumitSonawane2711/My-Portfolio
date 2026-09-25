import { clientEnv } from "@/shared/configs/clientEnv";

// Builds Cloudinary delivery URLs. Client-safe: only uses the public cloud name.

export type CldOptions = {
  width?: number;
  height?: number;
  /** "limit" (default) never upscales; "fill" crops to width×height using smart gravity. */
  crop?: "limit" | "fill";
  quality?: number;
  /** PDF page to render as an image (resume thumbnails). */
  page?: number;
  /** Force a format (e.g. "jpg" for PDF thumbnails); default f_auto. */
  format?: string;
};

const BASE = () => `https://res.cloudinary.com/${clientEnv.cloudinaryCloudName}/image/upload`;

export function cldUrl(publicId: string, options: CldOptions = {}) {
  const { width, height, crop = "limit", quality, page, format } = options;
  const parts = [
    format ? `f_${format}` : "f_auto",
    quality ? `q_${quality}` : "q_auto",
    crop === "fill" ? "c_fill,g_auto" : "c_limit",
    width && `w_${width}`,
    height && `h_${height}`,
    page && `pg_${page}`,
  ].filter(Boolean);

  return `${BASE()}/${parts.join(",")}/${publicId}${format ? `.${format}` : ""}`;
}

// The original file (e.g. a PDF). `downloadName` makes the browser save it
// instead of opening it, under that file name.
export function cldFileUrl(publicId: string, format: string, downloadName?: string) {
  const flag = downloadName
    ? `fl_attachment:${encodeURIComponent(downloadName.replace(/\.[a-z0-9]+$/i, ""))}/`
    : "";
  return `${BASE()}/${flag}${publicId}.${format}`;
}
