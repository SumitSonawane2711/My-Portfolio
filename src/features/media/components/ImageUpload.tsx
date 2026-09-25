"use client";

import { useRef, useState, type DragEvent } from "react";
import { ImagePlus, Loader2, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { CloudImage } from "@/shared/components/CloudImage";
import { cn } from "@/shared/libs/utils";
import { updateMediaAlt } from "../actions/mediaActions";
import { useCloudinaryUpload } from "../hooks/useCloudinaryUpload";
import type { MediaFolder, MediaRef } from "../interfaces/media";

type ImageUploadProps = {
  value: MediaRef | null;
  onChange: (value: MediaRef | null) => void;
  folder: MediaFolder;
  aspect?: "video" | "square" | "wide";
  /** Show an alt-text field under the preview (stored on the media asset). */
  withAlt?: boolean;
  className?: string;
};

const ASPECT = { video: "aspect-video", square: "aspect-square", wide: "aspect-[1200/630]" };

// Form field for one image. Use with React Hook Form's <Controller>.
export const ImageUpload = ({
  value,
  onChange,
  folder,
  aspect = "video",
  withAlt = true,
  className,
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const { upload, isUploading, progress } = useCloudinaryUpload(folder, "image");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    try {
      onChange(await upload(file));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    }
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    void handleFile(event.dataTransfer.files[0]);
  }

  async function saveAlt(alt: string) {
    if (!value || alt === (value.alt ?? "")) return;
    const result = await updateMediaAlt(value.id, alt);
    if (result.ok) onChange(result.data);
    else toast.error(result.error);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {value ? (
        <div className={cn("relative overflow-hidden rounded-lg border bg-muted", ASPECT[aspect])}>
          <CloudImage
            publicId={value.publicId}
            alt={value.alt ?? ""}
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              aria-label="Replace image"
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
            >
              {isUploading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              aria-label="Remove image"
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
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          disabled={isUploading}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground transition-colors hover:bg-muted/50",
            ASPECT[aspect],
            dragging && "border-primary bg-muted/50",
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Uploading… {progress}%
            </>
          ) : (
            <>
              <ImagePlus className="size-5" />
              Click or drop an image
            </>
          )}
        </button>
      )}

      {value && withAlt && (
        <Input
          key={value.id}
          defaultValue={value.alt ?? ""}
          placeholder="Alt text (describe the image)"
          onBlur={(e) => void saveAlt(e.target.value)}
        />
      )}
    </div>
  );
};
