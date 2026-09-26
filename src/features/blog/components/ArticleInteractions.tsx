"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { IconMessage2 } from "@tabler/icons-react";
import { LikeButton } from "@/features/likes/components/LikeButton";
import { FeedbackDialog } from "@/features/inbox/components/FeedbackDialog";
import { clientEnv } from "@/shared/configs/clientEnv";
import { ShareButtons } from "./ShareButtons";

type Dialog = { open: boolean; kind?: "SUGGESTION" | "CORRECTION"; quote?: string };
type Floating = { top: number; left: number; text: string } | null;

// Wraps the article body: selecting 3–500 characters shows a floating
// "Suggest a correction" button; the footer has likes, private feedback and sharing.
export const ArticleInteractions = ({
  slug,
  title,
  children,
}: {
  slug: string;
  title: string;
  children: ReactNode;
}) => {
  const articleRef = useRef<HTMLDivElement>(null);
  const [floating, setFloating] = useState<Floating>(null);
  const [dialog, setDialog] = useState<Dialog>({ open: false });

  useEffect(() => {
    const onSelectionEnd = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() ?? "";
      const inArticle =
        selection?.rangeCount && articleRef.current?.contains(selection.anchorNode ?? null);
      if (!inArticle || text.length < 3 || text.length > 500) return setFloating(null);
      const rect = selection!.getRangeAt(0).getBoundingClientRect();
      setFloating({
        top: rect.top + window.scrollY - 44,
        left: rect.left + window.scrollX + rect.width / 2,
        text,
      });
    };
    document.addEventListener("mouseup", onSelectionEnd);
    document.addEventListener("keyup", onSelectionEnd);
    return () => {
      document.removeEventListener("mouseup", onSelectionEnd);
      document.removeEventListener("keyup", onSelectionEnd);
    };
  }, []);

  return (
    <>
      <div ref={articleRef}>{children}</div>

      {floating && (
        <button
          type="button"
          // mousedown fires before the selection clears.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setDialog({ open: true, kind: "CORRECTION", quote: floating.text });
            setFloating(null);
          }}
          style={{ top: floating.top, left: floating.left }}
          className="absolute z-50 -translate-x-1/2 rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-neutral-100 dark:text-neutral-900"
        >
          Suggest a correction
        </button>
      )}

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <div className="flex flex-wrap items-center gap-3">
          <LikeButton slug={slug} />
          <button
            type="button"
            onClick={() => setDialog({ open: true, kind: "SUGGESTION" })}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <IconMessage2 className="h-4 w-4" />
            Send private feedback
          </button>
        </div>
        <ShareButtons title={title} url={`${clientEnv.siteUrl}/blog/${slug}`} />
      </div>

      <FeedbackDialog
        key={`${dialog.kind}-${dialog.quote ?? ""}`}
        open={dialog.open}
        onClose={() => setDialog({ open: false })}
        postSlug={slug}
        initialKind={dialog.kind}
        quotedText={dialog.quote}
      />
    </>
  );
};
