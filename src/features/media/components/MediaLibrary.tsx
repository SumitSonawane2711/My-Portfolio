"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { CloudImage } from "@/shared/components/CloudImage";
import { cldUrl, isLocalMedia } from "@/shared/libs/cloudinaryUrl";
import { deleteUnusedMedia } from "../actions/mediaActions";

export type MediaLibraryItem = {
  id: string;
  publicId: string;
  format: string | null;
  bytes: number | null;
  width: number | null;
  height: number | null;
  alt: string | null;
  usedBy: number;
};

export const MediaLibrary = ({ items }: { items: MediaLibraryItem[] }) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const unused = items.filter((item) => item.usedBy === 0).length;

  const cleanup = () =>
    startTransition(async () => {
      const result = await deleteUnusedMedia();
      if (!result.ok) return void toast.error(result.error);
      toast.success(
        result.data.deleted
          ? `Deleted ${result.data.deleted} unused file(s).`
          : "Nothing to clean up (unused files are kept for 24 hours).",
      );
      router.refresh();
    });

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {items.length} file(s), {unused} not used anywhere.
        </p>
        <Button variant="outline" onClick={cleanup} disabled={pending || unused === 0}>
          <Trash2 />
          Clean up unused files
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No uploads yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.id} className="overflow-hidden rounded-lg border">
              <div className="relative aspect-square bg-muted">
                {item.format === "pdf" && isLocalMedia(item.publicId) ? (
                  <span className="flex h-full items-center justify-center text-sm font-semibold text-muted-foreground">
                    PDF
                  </span>
                ) : item.format === "pdf" ? (
                  // eslint-disable-next-line @next/next/no-img-element -- Cloudinary-rendered PDF page
                  <img
                    src={cldUrl(item.publicId, { page: 1, format: "jpg", width: 300 })}
                    alt="PDF first page"
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <CloudImage
                    publicId={item.publicId}
                    alt={item.alt ?? ""}
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex items-center justify-between gap-2 p-2 text-xs">
                <span className="truncate text-muted-foreground" title={item.publicId}>
                  {item.format?.toUpperCase()} ·{" "}
                  {item.bytes ? `${Math.round(item.bytes / 1024)} KB` : "—"}
                </span>
                <Badge variant={item.usedBy ? "secondary" : "outline"}>
                  {item.usedBy ? `used ×${item.usedBy}` : "unused"}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
