"use client";

import { useRef } from "react";
import Image from "next/image";
import { FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { cldUrl } from "@/shared/libs/cloudinaryUrl";
import { useCloudinaryUpload } from "../hooks/useCloudinaryUpload";
import type { MediaFolder, MediaRef } from "../interfaces/media";

type FileUploadProps = {
  value: MediaRef | null;
  onChange: (value: MediaRef) => void;
  folder: MediaFolder;
  /** Shown next to the thumbnail, e.g. the download file name. */
  label?: string;
};

const formatBytes = (bytes: number | null) =>
  bytes == null
    ? ""
    : bytes < 1024 * 1024
      ? `${Math.round(bytes / 1024)} KB`
      : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

// PDF field (resumes). Shows a first-page thumbnail rendered by Cloudinary.
export const FileUpload = ({ value, onChange, folder, label }: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, progress } = useCloudinaryUpload(folder, "pdf");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    try {
      onChange(await upload(file));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    }
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border p-3">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <div className="relative h-24 w-18 shrink-0 overflow-hidden rounded border bg-muted">
        {value && (
          <Image
            src={cldUrl(value.publicId, { page: 1, format: "jpg", width: 144 })}
            alt="First page preview"
            fill
            unoptimized
            className="object-cover object-top"
          />
        )}
      </div>
      <div className="min-w-0 flex-1 text-sm">
        {value ? (
          <>
            <p className="truncate font-medium">{label ?? "PDF uploaded"}</p>
            <p className="text-muted-foreground">{formatBytes(value.bytes)}</p>
          </>
        ) : (
          <p className="text-muted-foreground">No file yet. PDF only, up to 10 MB.</p>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? <Loader2 className="animate-spin" /> : <FileUp />}
        {isUploading ? `${progress}%` : value ? "Replace" : "Upload PDF"}
      </Button>
    </div>
  );
};
