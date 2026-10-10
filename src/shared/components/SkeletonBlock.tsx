import { cn } from "@/shared/libs/utils";

/** Grey placeholder shape for the public site's loading pages. */
export const SkeletonBlock = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "animate-pulse rounded-lg bg-neutral-500/15 motion-reduce:animate-none",
      className,
    )}
  />
);
