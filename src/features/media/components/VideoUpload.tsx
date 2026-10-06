"use client";

import { useRef } from "react";
import { Film, Loader2, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { cldVideoPosterUrl, cldVideoUrl } from "@/shared/libs/cloudinaryUrl";
import { useCloudinaryUpload } from "../hooks/useCloudinaryUpload";
import type { MediaFolder, MediaRef } from "../interfaces/media";

type VideoUploadProps = {
  value: MediaRef | null;
  onChange: (value: MediaRef | null) => void;
  folder: MediaFolder;
};

// Form field for one short video. Use with React Hook Form's <Controller>.
export const VideoUpload = ({ value, onChange, folder }: VideoUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, progress } = useCloudinaryUpload(folder, "video");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    try {
      onChange(await upload(file));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {value ? (
        <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
          <video
            key={value.id}
            src={cldVideoUrl(value.publicId, 640)}
            poster={cldVideoPosterUrl(value.publicId, 640)}
            muted
            loop
            playsInline
            autoPlay
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              aria-label="Replace video"
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
            >
              {isUploading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              aria-label="Remove video"
              onClick={() => onChange(null)}
            >
              <X />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex aspect-video flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground transition-colors hover:bg-muted/50"
        >
          {isUploading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Uploading… {progress}%
            </>
          ) : (
            <>
              <Film className="size-5" />
              Choose a video (MP4, WebM or MOV, max 20 MB)
            </>
          )}
        </button>
      )}
    </div>
  );
};
