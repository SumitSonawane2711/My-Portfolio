import React from "react";
import { cn } from "@/shared/libs/utils";

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
        "fade-up text-3xl font-bold tracking-tighter text-balance text-primary md:text-5xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
};
