import type { TechBadge } from "@/features/technologies/interfaces/technology";
import { cldUrl } from "@/shared/libs/cloudinaryUrl";
import { cn } from "@/shared/libs/utils";

// Renders a technology icon from its pre-rendered SVG (or uploaded icon, or
// initial). Works in both server and client components.
export const TechBadgeIcon = ({ tech, className }: { tech: TechBadge; className?: string }) => {
  if (tech.svg) {
    return (
      <span
        aria-hidden="true"
        className={cn("inline-flex h-4 w-4 [&>svg]:h-full [&>svg]:w-full", className)}
        dangerouslySetInnerHTML={{ __html: tech.svg }}
      />
    );
  }
  if (tech.customIconPublicId) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- tiny fixed-size icon
      <img
        src={cldUrl(tech.customIconPublicId, { width: 64 })}
        alt=""
        aria-hidden="true"
        className={cn("h-4 w-4 object-contain", className)}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-4 w-4 items-center justify-center text-[10px] font-bold",
        className,
      )}
      style={tech.color ? { color: tech.color } : undefined}
    >
      {tech.name.charAt(0)}
    </span>
  );
};
