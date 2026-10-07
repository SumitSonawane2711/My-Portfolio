"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CloudImage } from "@/shared/components/CloudImage";
import { MediaPicker } from "./MediaPicker";
import type { MediaFolder, MediaRef } from "../interfaces/media";

type GalleryFieldProps = {
  value: MediaRef[];
  onChange: (value: MediaRef[]) => void;
  folder: MediaFolder;
  max?: number;
};

// Ordered list of images (project screenshots). Use with RHF's <Controller>.
export const GalleryField = ({ value, onChange, folder, max = 12 }: GalleryFieldProps) => {
  const [picking, setPicking] = useState(false);

  const move = (index: number, by: -1 | 1) => {
    const target = index + by;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      <MediaPicker
        open={picking}
        onOpenChange={setPicking}
        kind="image"
        folder={folder}
        multiple
        max={max - value.length}
        exclude={value.map((m) => m.id)}
        onSelect={(media) =>
          onChange([...value, ...media.filter((m) => !value.some((v) => v.id === m.id))])
        }
      />
      <ul className="grid grid-cols-3 gap-2">
        {value.map((media, index) => (
          <li
            key={media.id}
            className="group relative aspect-video overflow-hidden rounded-md border bg-muted"
          >
            <CloudImage
              publicId={media.publicId}
              alt={media.alt ?? ""}
              fill
              sizes="160px"
              className="object-cover"
            />
            <div className="absolute inset-x-1 bottom-1 flex justify-between opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <Button
                type="button"
                size="icon-xs"
                variant="secondary"
                aria-label="Move left"
                onClick={() => move(index, -1)}
              >
                <ArrowLeft />
              </Button>
              <Button
                type="button"
                size="icon-xs"
                variant="secondary"
                aria-label="Remove image"
                onClick={() => onChange(value.filter((m) => m.id !== media.id))}
              >
                <X />
              </Button>
              <Button
                type="button"
                size="icon-xs"
                variant="secondary"
                aria-label="Move right"
                onClick={() => move(index, 1)}
              >
                <ArrowRight />
              </Button>
            </div>
          </li>
        ))}
        {value.length < max && (
          <li>
            <button
              type="button"
              onClick={() => setPicking(true)}
              className="flex aspect-video w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed text-xs text-muted-foreground hover:bg-muted/50"
            >
              <ImagePlus className="size-4" />
              Add images
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};
