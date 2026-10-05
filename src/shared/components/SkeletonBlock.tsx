import { cn } from "@/shared/libs/utils";

/** Grey placeholder shape for the public site's loading pages. */
export const SkeletonBlock = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "animate-pulse rounded-lg bg-neutral-200/80 motion-reduce:animate-none dark:bg-neutral-800",
      className,
    )}
  />
);
