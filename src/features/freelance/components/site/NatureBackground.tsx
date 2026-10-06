import Image from "next/image";
import { cn } from "@/shared/libs/utils";
// Static, freelance-only background photo. Replace this file (same name) to
// change it; a large landscape (2000px+ wide) stays sharp on wide screens.
import background from "@/features/freelance/assets/background.jpg";

type NatureBackgroundProps = {
  /** Which part of the photo to keep in view when it's cropped to the section. */
  focus: "top" | "bottom";
  /** The hero image is above the fold: load it first. */
  priority?: boolean;
};

// The same photo behind the hero (visible at the top, fading down into the
// page) and behind the contact section (fading in towards the bottom). Each
// section adds its own fade on top.
export const NatureBackground = ({ focus, priority = false }: NatureBackgroundProps) => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-30"
  >
    <Image
      src={background}
      alt=""
      fill
      sizes="100vw"
      priority={priority}
      placeholder="blur"
      className={cn(
        "object-cover", // Phones: centred; wider screens keep the chosen part in view.
        "object-center",
        focus === "top" ? "md:object-[50%_35%]" : "md:object-[50%_80%]",
      )}
    />
  </div>
);
