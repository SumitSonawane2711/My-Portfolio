"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/libs/utils";
import { getLiveVisitors, type LiveCounts } from "../actions/liveActions";

const REFRESH_MS = 15 * 1000;

const SITES = [
  { key: "portfolio", label: "Portfolio", href: "/" },
  { key: "freelance", label: "Freelance", href: "/freelance" },
] as const;

// "Live now" on the dashboard: people with either site open right now,
// refreshed every 15 s while this tab is visible.
export const LiveVisitors = () => {
  const [counts, setCounts] = useState<LiveCounts | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (document.visibilityState !== "visible") return;
      const result = await getLiveVisitors();
      if (!cancelled && result.ok) setCounts(result.data);
    };
    void load();
    const timer = setInterval(load, REFRESH_MS);
    document.addEventListener("visibilitychange", load);
    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", load);
    };
  }, []);

  return (
    <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {SITES.map(({ key, label, href }) => {
        const value = counts?.[key];
        const live = (value ?? 0) > 0;
        return (
          <Card key={key} className="py-4">
            <CardContent className="flex items-center gap-4">
              <span className="relative flex size-3" aria-hidden>
                {live && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
                )}
                <span
                  className={cn(
                    "relative inline-flex size-3 rounded-full",
                    live ? "bg-emerald-500" : "bg-muted-foreground/40",
                  )}
                />
              </span>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  Live now on{" "}
                  <a href={href} target="_blank" rel="noreferrer" className="hover:underline">
                    {label}
                  </a>
                </p>
                <p className="text-2xl font-semibold tabular-nums" aria-live="polite">
                  {value ?? "–"}
                  <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                    {value === 1 ? "visitor" : "visitors"}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
