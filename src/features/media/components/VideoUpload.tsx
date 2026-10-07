"use client";

import { useState } from "react";
import { Film, RefreshCw, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cldVideoPosterUrl, cldVideoUrl } from "@/shared/libs/cloudinaryUrl";
import { MediaPicker } from "./MediaPicker";
import type { MediaFolder, MediaRef } from "../interfaces/media";

type VideoUploadProps = {
  value: MediaRef | null;
  onChange: (value: MediaRef | null) => void;
  folder: MediaFolder;
};

// Form field for one short video. Use with React Hook Form's <Controller>.
export const VideoUpload = ({ value, onChange, folder }: VideoUploadProps) => {
  const [picking, setPicking] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <MediaPicker
        open={picking}
        onOpenChange={setPicking}
        kind="video"
        folder={folder}
        exclude={value ? [value.id] : []}
        onSelect={([media]) => onChange(media)}
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
              onClick={() => setPicking(true)}
            >
              <RefreshCw />
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
          onClick={() => setPicking(true)}
          className="flex aspect-video flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground transition-colors hover:bg-muted/50"
        >
          <Film className="size-5" />
          Choose from library or upload (MP4, WebM or MOV, max 20 MB)
        </button>
      )}
    </div>
  );
};
