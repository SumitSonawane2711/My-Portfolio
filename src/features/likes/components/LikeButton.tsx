"use client";

import { useEffect, useState } from "react";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { toast } from "sonner";
import { cn } from "@/shared/libs/utils";

type LikeState = { count: number; liked: boolean };

export const LikeButton = ({ slug }: { slug: string }) => {
  const [state, setState] = useState<LikeState | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/blog/${slug}/like`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: LikeState | null) => {
        if (!cancelled && data) setState(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function toggle() {
    if (!state || busy) return;
    const previous = state;
    // Optimistic update; rolled back if the request fails.
    setState({ liked: !state.liked, count: state.count + (state.liked ? -1 : 1) });
    setBusy(true);
    try {
      const res = await fetch(`/api/blog/${slug}/like`, { method: "POST" });
      if (!res.ok) throw new Error(res.status === 429 ? "Slow down a little." : "Could not save.");
      setState(await res.json());
    } catch (error) {
      setState(previous);
      toast.error(error instanceof Error ? error.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  if (!state) {
    return (
      <span className="inline-block h-9 w-20 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
    );
  }

  const Icon = state.liked ? IconHeartFilled : IconHeart;
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={state.liked}
      aria-label={state.liked ? "Unlike this post" : "Like this post"}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800",
        state.liked ? "text-red-500" : "text-secondary",
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="tabular-nums">{state.count}</span>
    </button>
  );
};
