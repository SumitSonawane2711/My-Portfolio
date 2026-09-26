import React from "react";
import { cn } from "@/shared/libs/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-4xl bg-white p-4 text-neutral-900 md:px-18 dark:bg-neutral-900 dark:text-neutral-100",
        className,
      )}
    >
      {children}
    </div>
  );
};
