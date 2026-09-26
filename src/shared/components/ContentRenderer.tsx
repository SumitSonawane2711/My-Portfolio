import { decorateCodeBlocks } from "@/shared/libs/content/codeBlocks";
import { cn } from "@/shared/libs/utils";
import { CodeBlockCopy } from "./CodeBlockCopy";

type ContentRendererProps = {
  /** HTML produced by processContent() at save time — already sanitized. */
  html: string;
  className?: string;
};

// Renders stored rich text with the same `prose` classes the blog and project
// pages have always used. scroll-mt keeps anchored headings clear of the navbar.
// Code blocks get an editor-style frame (title bar, copy button, line numbers).
export const ContentRenderer = ({ html, className }: ContentRendererProps) => {
  const decorated = decorateCodeBlocks(html);

  return (
    <>
      <div
        className={cn(
          "prose prose-neutral dark:prose-invert [&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: decorated }}
      />
      {decorated !== html && <CodeBlockCopy />}
    </>
  );
};
