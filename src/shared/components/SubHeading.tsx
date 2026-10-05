import React from "react";
import { cn } from "@/shared/libs/utils";

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
      className={cn("fade-up max-w-2xl pt-4 text-base text-pretty text-secondary", className)}
      style={{ "--delay": "80ms" } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
};
