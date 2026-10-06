// Minimal copy formatting for text written in the dashboard (no HTML):
//   **phrase**   → bold
//   blank line   → new paragraph
// Everything else is plain text, so it's safe to render without sanitizing.

export type RichSegment = { text: string; bold: boolean };

export const toParagraphs = (text: string): string[] =>
  text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);

export const toSegments = (paragraph: string): RichSegment[] =>
  paragraph
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.length > 4 && part.startsWith("**") && part.endsWith("**")
        ? { text: part.slice(2, -2), bold: true }
        : { text: part, bold: false },
    );

/** The plain text (for meta descriptions, alt text and JSON-LD). */
export const toPlainText = (text: string) => toParagraphs(text).join(" ").replace(/\*\*/g, "");
