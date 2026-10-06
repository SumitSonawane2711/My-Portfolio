"use client";

import { useState } from "react";
import { explainCloudinaryError } from "@/shared/libs/cloudinaryErrors";
import { getUploadSignature, registerUpload } from "../actions/mediaActions";
import type { MediaFolder, MediaRef } from "../interfaces/media";

type UploadKind = "image" | "pdf" | "video";

const LIMITS: Record<UploadKind, { maxBytes: number; accept: (type: string) => boolean }> = {
  image: { maxBytes: 5 * 1024 * 1024, accept: (type) => type.startsWith("image/") },
  pdf: { maxBytes: 10 * 1024 * 1024, accept: (type) => type === "application/pdf" },
  video: {
    maxBytes: 20 * 1024 * 1024,
    accept: (type) => ["video/mp4", "video/webm", "video/quicktime"].includes(type),
  },
};

// Signed direct upload: the file goes straight from the browser to Cloudinary
// (never through our server), then the verified result is recorded as a MediaAsset.
export function useCloudinaryUpload(folder: MediaFolder, kind: UploadKind = "image") {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function upload(file: File): Promise<MediaRef> {
    const limit = LIMITS[kind];
    if (!limit.accept(file.type)) {
      throw new Error(
        kind === "pdf"
          ? "Please choose a PDF file."
          : kind === "video"
            ? "Please choose an MP4, WebM or MOV video."
            : "Please choose an image.",
      );
    }
    if (file.size > limit.maxBytes) {
      throw new Error(`File is too large (max ${limit.maxBytes / 1024 / 1024} MB).`);
    }

    setIsUploading(true);
    setProgress(0);
    try {
      const signed = await getUploadSignature(folder, kind);
      if (!signed.ok) throw new Error(signed.error);
      const {
        cloudName,
        apiKey,
        timestamp,
        folder: target,
        allowedFormats,
        signature,
      } = signed.data;

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", apiKey);
      form.append("timestamp", String(timestamp));
      form.append("folder", target);
      form.append("allowed_formats", allowedFormats);
      form.append("signature", signature);

      const result = await postWithProgress(
        // Videos go to Cloudinary's video pipeline; PDFs are stored as images.
        `https://api.cloudinary.com/v1_1/${cloudName}/${kind === "video" ? "video" : "image"}/upload`,
        form,
        setProgress,
      );

      const registered = await registerUpload(result, kind);
      if (!registered.ok) throw new Error(registered.error);
      return registered.data;
    } finally {
      setIsUploading(false);
    }
  }

  return { upload, isUploading, progress };
}

// fetch() has no upload progress; XHR does.
function postWithProgress(url: string, body: FormData, onProgress: (percent: number) => void) {
  return new Promise<unknown>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText || "{}");
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new Error(explainCloudinaryError(data?.error?.message)));
    };
    xhr.onerror = () => reject(new Error("Upload failed. Check your connection."));
    xhr.send(body);
  });
}
