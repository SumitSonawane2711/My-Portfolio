import React from "react";
import { cn } from "@/shared/libs/utils";

// The lead under a page title, centred to match it.
export const SubHeading = ({
  as: Tag = "p",
  children,
  className,
}: {
  as?: "p" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Tag
      className={cn(
        "fade-up mx-auto max-w-2xl pt-3 text-center text-base text-pretty text-secondary md:text-lg",
        className,
      )}
      style={{ "--delay": "80ms" } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
};
