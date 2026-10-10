import React from "react";
import { cn } from "@/shared/libs/utils";

// Page title (ChaiUI): medium weight, centred.
export const Heading = ({
  as: Tag = "h1",
  children,
  className,
}: {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Tag
      className={cn(
        "fade-up text-center text-2xl font-medium tracking-tight text-balance text-primary sm:text-3xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
};
