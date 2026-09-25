import type { TechBadge } from "@/features/technologies/interfaces/technology";
import { cn } from "@/shared/libs/utils";
import { TechBadgeIcon } from "./TechBadgeIcon";

// Deterministic tilt/offset pattern so a "scattered" cluster looks organic
// without random values causing SSR/client hydration mismatches.
const SCATTER_PATTERN = [
  { rotate: -6, translateY: 0 },
  { rotate: 4, translateY: 6 },
  { rotate: -3, translateY: -4 },
  { rotate: 8, translateY: 2 },
  { rotate: -8, translateY: -6 },
  { rotate: 5, translateY: 4 },
  { rotate: -4, translateY: 0 },
  { rotate: 6, translateY: -3 },
];

// Technologies come from the database with their icon pre-rendered on the
// server, so this works inside client components too.
export const TechIconGroup = ({
  technologies,
  iconClassName,
  itemClassName = "inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900",
  scatter = false,
}: {
  technologies: TechBadge[];
  iconClassName?: string;
  itemClassName?: string;
  /** Loose, tilted cluster instead of a tidy wrapped grid — for decorative/background use */
  scatter?: boolean;
}) => {
  return (
    <div className={cn("flex flex-wrap gap-2", scatter && "justify-center gap-3 sm:gap-4")}>
      {technologies.map((technology, idx) => {
        const pattern = SCATTER_PATTERN[idx % SCATTER_PATTERN.length];

        return (
          <span
            key={technology.slug}
            aria-label={technology.name}
            title={technology.name}
            className={itemClassName}
            style={
              scatter
                ? {
                    transform: `rotate(${pattern.rotate}deg) translateY(${pattern.translateY}px)`,
                  }
                : undefined
            }
          >
            <TechBadgeIcon tech={technology} className={iconClassName} />
          </span>
        );
      })}
    </div>
  );
};
