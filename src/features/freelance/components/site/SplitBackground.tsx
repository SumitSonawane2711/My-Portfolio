import Image from "next/image";
import { cn } from "@/shared/libs/utils";
// Static, freelance-only background. Replace this file (same name) to change
// it. Best proportions: about 4:5 (e.g. 1600×2000), with the top half calm
// enough for the hero text; phones crop the sides.
import background from "@/features/freelance/assets/background.jpg";

/**
 * One full-width image box, two hero heights tall (hero = 88svh). The hero
 * shows it anchored at the top (the first half); the footer band, also 88svh,
 * shows it anchored at the bottom (the second half). Same box, same scale, so
 * the two halves read as one picture with the page in between.
 */
export const SPLIT_HALF_HEIGHT = "min-h-[88svh]";

type SplitBackgroundProps = {
  anchor: "top" | "bottom";
  /** The hero image is above the fold: load it first. */
  priority?: boolean;
};

export const SplitBackground = ({ anchor, priority = false }: SplitBackgroundProps) => (
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className={cn("absolute inset-x-0 h-[176svh]", anchor === "top" ? "top-0" : "bottom-0")}>
      <Image
        src={background}
        alt=""
        fill
        sizes="100vw"
        priority={priority}
        placeholder="blur"
        className="object-cover"
      />
    </div>
  </div>
);
