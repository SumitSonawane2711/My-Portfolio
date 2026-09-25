// Code-block languages offered in the editor and loaded into the highlighter.
// Kept separate from highlight.ts so the browser toolbar never imports Shiki.
export const CODE_LANGUAGES = [
  { value: "typescript", label: "TypeScript" },
  { value: "tsx", label: "TSX" },
  { value: "javascript", label: "JavaScript" },
  { value: "jsx", label: "JSX" },
  { value: "json", label: "JSON" },
  { value: "bash", label: "Bash" },
  { value: "css", label: "CSS" },
  { value: "html", label: "HTML" },
  { value: "sql", label: "SQL" },
  { value: "prisma", label: "Prisma" },
  { value: "yaml", label: "YAML" },
  { value: "markdown", label: "Markdown" },
  { value: "python", label: "Python" },
  { value: "diff", label: "Diff" },
] as const;

export type CodeLanguage = (typeof CODE_LANGUAGES)[number]["value"];

export const LANGUAGE_ALIASES: Record<string, CodeLanguage> = {
  ts: "typescript",
  js: "javascript",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  yml: "yaml",
  md: "markdown",
  py: "python",
};
