"use client";

import { useEffect, useState } from "react";
import { IconArrowUp } from "@tabler/icons-react";
import { cn } from "@/shared/libs/utils";

// Round button in the corner once you've scrolled past the first screen.
export const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setVisible(window.scrollY > window.innerHeight);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <a
      href="#top"
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed right-5 bottom-5 z-40 flex size-12 items-center justify-center rounded-full bg-neutral-950 text-white shadow-lg ring-1 ring-white/20 transition duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none md:right-8 md:bottom-8",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <IconArrowUp className="size-5" />
    </a>
  );
};
