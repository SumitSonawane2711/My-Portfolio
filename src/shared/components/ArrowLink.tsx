import Link from "next/link";
import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import { cn } from "@/shared/libs/utils";

type ArrowLinkProps = {
  href: string;
  children: React.ReactNode;
  /** Opens in a new tab with a ↗ arrow. */
  external?: boolean;
  className?: string;
};

// Text link whose arrow nudges forward on hover/focus.
export const ArrowLink = ({ href, children, external = false, className }: ArrowLinkProps) => {
  const Arrow = external ? IconArrowUpRight : IconArrowRight;
  return (
    <Link
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={cn(
        "group/arrow inline-flex items-center gap-1 rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none",
        className,
      )}
    >
      {children}
      <Arrow
        aria-hidden
        className={cn(
          "size-4 transition-transform duration-200 motion-reduce:transition-none",
          external
            ? "group-hover/arrow:translate-x-0.5 group-hover/arrow:-translate-y-0.5"
            : "group-hover/arrow:translate-x-1",
        )}
      />
    </Link>
  );
};
