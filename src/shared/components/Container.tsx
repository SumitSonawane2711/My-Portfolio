import React from "react";
import { cn } from "@/shared/libs/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

// The one page width, shared with the navbar and footer.
export const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-6 py-8 sm:px-10 sm:py-12", className)}>
      {children}
    </div>
  );
};
