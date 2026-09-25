import { createHighlighter, type Highlighter } from "shiki";
import { decodeEntities } from "./entities";
import { CODE_LANGUAGES, LANGUAGE_ALIASES } from "./languages";

// Runs at SAVE time on the server (and in the importer) — visitors receive
// pre-highlighted HTML and no highlighter JavaScript.

const LANGS = CODE_LANGUAGES.map((l) => l.value);
let highlighter: Promise<Highlighter> | undefined;

// One highlighter per process, created lazily (loading grammars is slow).
const getHighlighter = () =>
  (highlighter ??= createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: [...LANGS],
  }));

const resolveLang = (raw: string | undefined) => {
  const lang = raw?.toLowerCase() ?? "";
  const resolved = LANGUAGE_ALIASES[lang] ?? lang;
  return (LANGS as readonly string[]).includes(resolved) ? resolved : "text";
};

const CODE_BLOCK = /<pre><code(?: class="language-([\w+-]+)")?>([\s\S]*?)<\/code><\/pre>/g;

/**
 * Replaces every `<pre><code class="language-x">` block with Shiki output.
 * Dual themes: colors come from --shiki-light / --shiki-dark CSS variables,
 * switched by the `.dark` class in globals.css, so code follows the site theme.
 */
export async function highlightCodeBlocks(html: string) {
  if (!html.includes("<pre")) return html;
  const shiki = await getHighlighter();

  return html.replace(CODE_BLOCK, (_match, lang: string | undefined, code: string) =>
    shiki.codeToHtml(decodeEntities(code).replace(/\n$/, ""), {
      lang: resolveLang(lang),
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    }),
  );
}
