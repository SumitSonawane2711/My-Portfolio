// Small text helpers shared by the content pipeline and the mailer.
// No `server-only`: the importer script uses them too.

const NAMED: Record<string, string> = {
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&nbsp;": " ",
};

// Decodes the common entities; `&amp;` goes last so "&amp;lt;" stays "&lt;".
export const decodeEntities = (html: string) =>
  html
    .replace(/&(lt|gt|quot|#39|#x27|nbsp);/g, (m) => NAMED[m] ?? m)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, "&");

export const stripTags = (html: string) =>
  decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

export const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
