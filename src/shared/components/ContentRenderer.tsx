import { cn } from "@/shared/libs/utils";

type ContentRendererProps = {
  /** HTML produced by processContent() at save time — already sanitized. */
  html: string;
  className?: string;
};

// Renders stored rich text with the same `prose` classes the blog and project
// pages have always used. scroll-mt keeps anchored headings clear of the navbar.
export const ContentRenderer = ({ html, className }: ContentRendererProps) => {
  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert [&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24 [&_pre]:overflow-x-auto",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
