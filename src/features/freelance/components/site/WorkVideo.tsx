"use client";

import { useEffect, useRef } from "react";
import { cldVideoPosterUrl, cldVideoUrl } from "@/shared/libs/cloudinaryUrl";

type WorkVideoProps = { publicId: string; label: string };

// A silent screen recording on loop. It only plays while on screen (and loads
// nothing before), and visitors who prefer reduced motion see the first frame.
export const WorkVideo = ({ publicId, label }: WorkVideoProps) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduced.matches) {
          video.play().catch(() => {}); // autoplay can still be refused (e.g. data saver)
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={cldVideoUrl(publicId, 1080)}
      poster={cldVideoPosterUrl(publicId, 1080)}
      aria-label={label}
      muted
      loop
      playsInline
      preload="none"
      className="absolute inset-0 h-full w-full object-cover object-top"
    />
  );
};
