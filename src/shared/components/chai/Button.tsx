import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { IconArrowUpRight } from "@tabler/icons-react";
import * as React from "react";
import { cn } from "@/shared/libs/utils";

/**
 * ChaiUI buttons for the portfolio (the dashboard keeps shared/components/ui).
 *
 * - `solid`: white on dark with asymmetric corners. Once per screen, for the
 *   main action. Carries an up-right arrow unless `iconRight={null}`.
 * - `outline`: mirrored corners, sits beside `solid`.
 * - `soft`: the button on cards (light grey on dark), font-semibold.
 * - `muted`: the quiet "View all" beside a section heading.
 * - `ghost`: icon and toolbar buttons.
 *
 * There is no colour prop on purpose: orange never fills a button.
 */
export const chaiButtonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        soft: "rounded-md bg-primary font-montserrat font-semibold text-primary-foreground hover:bg-primary/90",
        solid:
          "btn-asym bg-neutral-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200",
        outline:
          "btn-asym-mirror border border-neutral-200 bg-transparent text-foreground hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-black/90",
        muted:
          "rounded-md bg-[#d4d4d866] font-montserrat text-[#52525b] hover:bg-[#d4d4d8] dark:bg-[#71717a33] dark:text-[#d4d4d8] dark:hover:bg-black/70",
        ghost:
          "rounded-md text-foreground hover:bg-neutral-500/10 hover:text-brand dark:hover:bg-white/5",
      },
      size: {
        sm: "h-8 gap-1.5 px-3",
        md: "h-9 px-4",
        lg: "h-10 px-6",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "soft", size: "md" },
  },
);

type ChaiButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof chaiButtonVariants> & {
    asChild?: boolean;
    /** An icon after the label. `solid` defaults to an up-right arrow; pass null to drop it. */
    iconRight?: React.ReactNode;
  };

export function ChaiButton({
  className,
  variant,
  size,
  asChild = false,
  iconRight,
  children,
  ...props
}: ChaiButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  const icon =
    iconRight === undefined && variant === "solid" && size !== "icon" ? (
      <IconArrowUpRight />
    ) : (
      iconRight
    );
  return (
    <Comp className={cn(chaiButtonVariants({ variant, size }), className)} {...props}>
      <Slot.Slottable>{children}</Slot.Slottable>
      {icon ? (
        <span aria-hidden="true" className="-ml-1 inline-flex">
          {icon}
        </span>
      ) : null}
    </Comp>
  );
}
