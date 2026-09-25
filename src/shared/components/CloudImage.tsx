"use client";

import Image, { type ImageProps } from "next/image";
import { cldUrl } from "@/shared/libs/cloudinaryUrl";

type CloudImageProps = Omit<ImageProps, "src" | "loader"> & {
  publicId: string;
  /** "fill" crops to the requested aspect with smart gravity (avatars, thumbnails). */
  crop?: "limit" | "fill";
};

// next/image backed by Cloudinary: Next picks the width, Cloudinary resizes
// and serves the best format. Pass the stored width/height to avoid layout shift.
export const CloudImage = ({ publicId, crop = "limit", alt, ...props }: CloudImageProps) => {
  const aspect =
    crop === "fill" && typeof props.width === "number" && typeof props.height === "number"
      ? props.height / props.width
      : undefined;

  return (
    <Image
      {...props}
      alt={alt}
      src={publicId}
      loader={({ src, width, quality }) =>
        cldUrl(src, {
          width,
          height: aspect ? Math.round(width * aspect) : undefined,
          crop,
          quality,
        })
      }
    />
  );
};
