"use client";

import { useEffect } from "react";

const HEARTBEAT_MS = 30 * 1000;

/**
 * Tells the server this visitor has the site open (for the dashboard's live
 * count): every 30 s while the tab is visible, and "left" when it's hidden or
 * closed. No cookies, nothing stored in the browser. Renders nothing.
 */
export const LiveVisitorBeacon = ({ site }: { site: "PORTFOLIO" | "FREELANCE" }) => {
  useEffect(() => {
    const send = (left = false) => {
      const body = JSON.stringify({ site, left });
      // sendBeacon survives the tab closing; fetch is the fallback.
      if (!navigator.sendBeacon?.("/api/live", new Blob([body], { type: "application/json" }))) {
        fetch("/api/live", { method: "POST", body, keepalive: true }).catch(() => {});
      }
    };

    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      clearInterval(timer);
      send();
      timer = setInterval(send, HEARTBEAT_MS);
    };
    const stop = () => {
      clearInterval(timer);
      timer = undefined;
      send(true);
    };
    const onVisibility = () => (document.visibilityState === "visible" ? start() : stop());

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", stop);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", stop);
      clearInterval(timer);
    };
  }, [site]);

  return null;
};
