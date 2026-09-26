import { CODE_LANGUAGES } from "./languages";

// Wraps highlighted code blocks in an editor-style frame at RENDER time:
// title bar (window dots, language, copy button) + line numbers (CSS, see
// globals.css). Doing it at render time means stored HTML never needs
// rewriting when the frame's markup changes, and older content (saved before
// blocks carried a language) still gets the frame.

const LABELS: Record<string, string> = {
  ...Object.fromEntries(CODE_LANGUAGES.map((l) => [l.value, l.label])),
  text: "Plain text",
};

// Any <pre> whose class starts with "shiki", whatever the attribute order.
const SHIKI_PRE = /<pre\b[^>]*\bclass="shiki[^"]*"[^>]*>[\s\S]*?<\/pre>/g;

const COPY_ICON =
  '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

export function decorateCodeBlocks(html: string) {
  if (!html.includes('class="shiki')) return html;

  return html.replace(SHIKI_PRE, (pre) => {
    const language = pre.match(/data-language="([\w+-]+)"/)?.[1];
    const label = (language && LABELS[language]) || "Code";
    return (
      `<figure class="code-block not-prose">` +
      `<figcaption class="code-block-header">` +
      `<span class="code-block-dots" aria-hidden="true"><i></i><i></i><i></i></span>` +
      `<span class="code-block-lang">${label}</span>` +
      `<button type="button" class="code-block-copy" data-copy-code aria-label="Copy code">${COPY_ICON}<span>Copy</span></button>` +
      `</figcaption>${pre}</figure>`
    );
  });
}
