import { cn } from "@/shared/libs/utils";

/**
 * The ChaiUI page background: one SVG with a warm glow and faint hexagons,
 * centred at the top behind everything. Put it first inside a wrapper with
 * `relative isolate overflow-x-clip`.
 *
 * - Light mode inverts it, and a half-turn of hue keeps the browns warm (a
 *   plain invert turns them blue).
 * - The bottom is masked out so no edge shows where the image stops.
 */
export function Backdrop({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a large decorative SVG, nothing to optimise
    <img
      src="/chaiui/background.svg"
      alt=""
      aria-hidden="true"
      fetchPriority="high"
      decoding="async"
      className={cn(
        "pointer-events-none absolute top-0 left-1/2 -z-10 w-[2842px] max-w-none -translate-x-1/2 select-none",
        "[mask-image:linear-gradient(to_bottom,#000_55%,transparent)]",
        "hue-rotate-180 invert dark:hue-rotate-0 dark:invert-0",
        className,
      )}
    />
  );
}
