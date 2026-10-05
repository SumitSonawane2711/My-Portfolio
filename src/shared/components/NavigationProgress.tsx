"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/libs/utils";

// Delay before the bar appears, so instant (prefetched) navigations don't flash.
const SHOW_AFTER_MS = 120;
// If the path never changes (navigation cancelled or failed), give up quietly.
const GIVE_UP_AFTER_MS = 15_000;

const isInternalNavigation = (event: MouseEvent) => {
  // Checked in the capture phase: next/link always calls preventDefault() itself.
  if (event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const anchor = (event.target as Element | null)?.closest?.("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) return null;
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  // Same page (or only a #hash / ?query change on it): nothing to wait for.
  if (url.pathname === window.location.pathname) return null;
  return url;
};

/**
 * A thin bar at the top of the screen while the next page loads. It starts on
 * a click on an internal link and finishes when the URL path changes. It is
 * driven through a ref (no React state), so it never re-renders the page.
 */
export const NavigationProgress = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const giveUp = useRef<ReturnType<typeof setTimeout> | null>(null);
  const running = useRef(false);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!isInternalNavigation(event) || running.current) return;
      running.current = true;
      timer.current = setTimeout(() => {
        const bar = barRef.current;
        if (!bar) return;
        bar.style.transition = "none";
        bar.style.width = "0%";
        bar.style.opacity = "1";
        void bar.offsetWidth; // restart the transition from 0
        bar.style.transition = "width 10s cubic-bezier(0.05, 0.7, 0.1, 1)";
        bar.style.width = "90%";
      }, SHOW_AFTER_MS);
      giveUp.current = setTimeout(() => {
        running.current = false;
        if (barRef.current) barRef.current.style.opacity = "0";
      }, GIVE_UP_AFTER_MS);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // The new page is rendering: complete the bar and fade it out.
  useEffect(() => {
    if (!running.current) return;
    running.current = false;
    if (timer.current) clearTimeout(timer.current);
    if (giveUp.current) clearTimeout(giveUp.current);
    const bar = barRef.current;
    if (!bar || bar.style.opacity !== "1") return;
    bar.style.transition = "width 200ms ease-out, opacity 250ms ease 200ms";
    bar.style.width = "100%";
    bar.style.opacity = "0";
  }, [pathname]);

  return (
    <div
      ref={barRef}
      aria-hidden
      style={{ width: "0%", opacity: 0 }}
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-[100] h-0.5 bg-neutral-900 shadow-[0_0_8px_rgba(0,0,0,0.25)] dark:bg-white dark:shadow-[0_0_8px_rgba(255,255,255,0.4)]",
        className,
      )}
    />
  );
};
