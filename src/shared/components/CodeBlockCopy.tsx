"use client";

import { useEffect } from "react";

// Makes the "Copy" buttons in rendered code blocks work (see
// shared/libs/content/codeBlocks.ts). One delegated listener per page; the
// line numbers are CSS-generated, so they're never part of the copied text.
export const CodeBlockCopy = () => {
  useEffect(() => {
    const timers = new Map<HTMLButtonElement, number>();

    const onClick = async (event: MouseEvent) => {
      const button = (event.target as Element | null)?.closest<HTMLButtonElement>(
        "button[data-copy-code]",
      );
      if (!button) return;

      const code = button.closest("figure")?.querySelector("pre code")?.textContent ?? "";
      const label = button.querySelector("span");
      try {
        await navigator.clipboard.writeText(code);
        if (label) label.textContent = "Copied!";
      } catch {
        if (label) label.textContent = "Press Ctrl+C";
      }
      window.clearTimeout(timers.get(button));
      timers.set(
        button,
        window.setTimeout(() => {
          if (label) label.textContent = "Copy";
        }, 2000),
      );
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return null;
};
