"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { Check, Loader2, Search, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { CloudImage } from "@/shared/components/CloudImage";
import { cldVideoPosterUrl } from "@/shared/libs/cloudinaryUrl";
import { cn } from "@/shared/libs/utils";
import { listMediaLibrary } from "../actions/mediaActions";
import { useCloudinaryUpload } from "../hooks/useCloudinaryUpload";
import type { MediaFolder, MediaRef } from "../interfaces/media";

type MediaPickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: "image" | "video";
  /** Where new uploads go. */
  folder: MediaFolder;
  /** Pick several (gallery) instead of one. */
  multiple?: boolean;
  /** How many more can be picked (multiple only). */
  max?: number;
  /** Already in the field: shown as "added" and not picked twice. */
  exclude?: string[];
  onSelect: (media: MediaRef[]) => void;
};

const ACCEPT = { image: "image/*", video: "video/mp4,video/webm,video/quicktime" };

// Popup for choosing media: everything already uploaded (newest first), plus
// uploading new files. One pick closes it; in multiple mode you tick several
// and confirm. New uploads are picked straight away.
export const MediaPicker = ({
  open,
  onOpenChange,
  kind,
  folder,
  multiple = false,
  max = Infinity,
  exclude = [],
  onSelect,
}: MediaPickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<MediaRef[] | null>(null); // null = loading
  const [selected, setSelected] = useState<MediaRef[]>([]);
  const [query, setQuery] = useState("");
  const [dragging, setDragging] = useState(false);
  // Files whose image can't load (e.g. deleted at the source) are left out.
  const [broken, setBroken] = useState<string[]>([]);
  const hide = (id: string) => setBroken((current) => [...current, id]);
  const { upload, isUploading, progress } = useCloudinaryUpload(folder, kind);

  // Load the library each time the popup opens.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void listMediaLibrary(kind).then((result) => {
      if (cancelled) return;
      if (result.ok) setItems(result.data);
      else {
        toast.error(result.error);
        setItems([]);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [open, kind]);

  const close = (next: boolean) => {
    if (!next) {
      setSelected([]);
      setQuery("");
      setItems(null);
    }
    onOpenChange(next);
  };

  const finish = (media: MediaRef[]) => {
    if (!open) return; // already closing
    if (media.length) onSelect(media);
    close(false);
  };

  const toggle = (media: MediaRef) => {
    if (!multiple) return finish([media]);
    setSelected((current) =>
      current.some((m) => m.id === media.id)
        ? current.filter((m) => m.id !== media.id)
        : current.length < max
          ? [...current, media]
          : current,
    );
  };

  async function uploadFiles(files: FileList | null) {
    const list = Array.from(files ?? []).slice(0, multiple ? max - selected.length : 1);
    const uploaded: MediaRef[] = [];
    for (const file of list) {
      try {
        uploaded.push(await upload(file));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload failed.");
      }
    }
    if (!uploaded.length) return;
    if (!multiple) return finish(uploaded);
    setItems((current) => [...uploaded, ...(current ?? [])]);
    setSelected((current) => [...current, ...uploaded]);
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    void uploadFiles(event.dataTransfer.files);
  }

  const term = query.trim().toLowerCase();
  const visible = (items ?? []).filter(
    (m) =>
      !broken.includes(m.id) &&
      (!term ||
        m.publicId.toLowerCase().includes(term) ||
        (m.alt ?? "").toLowerCase().includes(term)),
  );
  const noun = kind === "video" ? "video" : "image";

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-4 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Choose {multiple ? `${noun}s` : kind === "video" ? "a video" : "an image"}
          </DialogTitle>
          <DialogDescription>
            Pick from what you&apos;ve already uploaded, or upload a new {noun}.
          </DialogDescription>
        </DialogHeader>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT[kind]}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            void uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
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
              "flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50",
              dragging && "border-primary bg-muted/50",
            )}
          >
            {isUploading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Uploading… {progress}%
              </>
            ) : (
              <>
                <Upload className="size-4" /> Upload new (click or drop{" "}
                {multiple ? "files" : "a file"})
              </>
            )}
          </button>
          <div className="relative sm:w-56">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or alt text"
              className="h-full pl-8"
              aria-label="Search the library"
            />
          </div>
        </div>

        <div className="-mx-1 min-h-48 flex-1 overflow-y-auto px-1">
          {items === null ? (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" /> Loading library…
            </div>
          ) : visible.length === 0 ? (
            <p className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              {items.length ? "Nothing matches your search." : `No ${noun}s uploaded yet.`}
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {visible.map((media) => {
                const added = exclude.includes(media.id);
                const isSelected = selected.some((m) => m.id === media.id);
                return (
                  <li key={media.id}>
                    <button
                      type="button"
                      disabled={added}
                      onClick={() => toggle(media)}
                      aria-pressed={multiple ? isSelected : undefined}
                      title={media.alt || media.publicId}
                      className={cn(
                        "group relative block aspect-video w-full overflow-hidden rounded-md border bg-muted ring-offset-2 ring-offset-background transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                        isSelected && "ring-2 ring-primary",
                        added ? "cursor-not-allowed opacity-40" : "hover:opacity-90",
                      )}
                    >
                      {kind === "video" ? (
                        // eslint-disable-next-line @next/next/no-img-element -- Cloudinary-rendered video frame
                        <img
                          src={cldVideoPosterUrl(media.publicId, 320)}
                          alt={media.alt ?? ""}
                          onError={() => hide(media.id)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <CloudImage
                          publicId={media.publicId}
                          alt={media.alt ?? ""}
                          fill
                          sizes="200px"
                          onError={() => hide(media.id)}
                          className="object-cover"
                        />
                      )}
                      {(isSelected || added) && (
                        <span className="absolute top-1.5 right-1.5 flex items-center gap-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                          <Check className="size-3" />
                          {added
                            ? "added"
                            : multiple
                              ? selected.findIndex((s) => s.id === media.id) + 1
                              : ""}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {multiple && (
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => close(false)}>
              Cancel
            </Button>
            <Button type="button" disabled={selected.length === 0} onClick={() => finish(selected)}>
              Add {selected.length || ""} {selected.length === 1 ? noun : `${noun}s`}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
