import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/shared/libs/utils";

/**
 * An outlined meta chip (a technology, a tag). Grey by default; tones are
 * text and a thin stroke, never a fill.
 */
export const chipVariants = cva(
  "inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11px] leading-4 whitespace-nowrap",
  {
    variants: {
      tone: {
        default: "border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400",
        success: "border-green-600/30 text-green-700 dark:border-green-400/30 dark:text-green-400",
        special:
          "border-purple-600/30 text-purple-700 dark:border-purple-400/30 dark:text-purple-400",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

export function Chip({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof chipVariants>) {
  return <span className={cn(chipVariants({ tone }), className)} {...props} />;
}
