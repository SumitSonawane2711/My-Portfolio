import Image from "next/image";
import { cn } from "@/shared/libs/utils";
// Static, freelance-only nature photo. Replace this file (same name) to change
// it. Best: a wide landscape (about 3:2, e.g. 2400×1600) with sky and scenery
// at the top (behind the hero) and grass or ground at the bottom (the footer).
import background from "@/features/freelance/assets/background.jpg";

type NatureBackgroundProps = {
  /** "top": the sky/scenery (hero). "bottom": the horizon and ground (footer). */
  focus: "top" | "bottom";
  /** The hero image is above the fold: load it first. */
  priority?: boolean;
};

// The same photo behind the hero and the footer, like a frame around the page.
// Each section adds its own soft cream fades on top (see FreelanceHero/Footer).
export const NatureBackground = ({ focus, priority = false }: NatureBackgroundProps) => (
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <Image
      src={background}
      alt=""
      fill
      sizes="100vw"
      priority={priority}
      placeholder="blur"
      className={cn("object-cover", focus === "top" ? "object-[50%_8%]" : "object-[50%_72%]")}
    />
  </div>
);
