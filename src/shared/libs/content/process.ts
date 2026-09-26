import sanitizeHtml from "sanitize-html";
import readingTime from "reading-time";
import { slugify } from "@/shared/libs/slug";
import { stripTags } from "./entities";
import { highlightCodeBlocks } from "./highlight";

// The server-side content pipeline, run whenever rich text is saved (and by
// the importer). Anything from the browser can be forged, so the HTML is
// always re-cleaned here. No `server-only`: scripts/importContent.ts uses it.
//
// Order matters: sanitize → heading ids → highlight. Shiki's trusted output
// uses inline styles, which the sanitizer would strip if it ran afterwards.

export type TocItem = { id: string; text: string; level: 2 | 3 };

export type ProcessedContent = {
  html: string;
  toc: TocItem[];
  readingMinutes: number;
  plainText: string;
};

const isCloudinaryOrLocal = (src: string) =>
  src.startsWith("https://res.cloudinary.com/") || (src.startsWith("/") && !src.startsWith("//"));

const SANITIZE: sanitizeHtml.IOptions = {
  allowedTags: [
    "h2",
    "h3",
    "h4",
    "p",
    "br",
    "hr",
    "blockquote",
    "strong",
    "em",
    "u",
    "s",
    "code",
    "pre",
    "a",
    "ul",
    "ol",
    "li",
    "img",
    "figure",
    "figcaption",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "colgroup",
    "col",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    code: ["class"],
    th: ["colspan", "rowspan"],
    td: ["colspan", "rowspan"],
  },
  allowedClasses: { code: ["language-*"] },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["https"] },
  allowProtocolRelative: false,
  transformTags: {
    // The page title is the only <h1>.
    h1: "h2",
    a: (tagName, attribs) => {
      const href = attribs.href ?? "";
      const next: sanitizeHtml.Attributes = /^https?:\/\//.test(href)
        ? { href, target: "_blank", rel: "noopener noreferrer nofollow" }
        : { href };
      return { tagName, attribs: next };
    },
    img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
  },
  // Images only from Cloudinary (or this site); anything else is dropped.
  exclusiveFilter: (frame) => frame.tag === "img" && !isCloudinaryOrLocal(frame.attribs.src ?? ""),
};

function addHeadingIds(html: string) {
  const toc: TocItem[] = [];
  const used = new Set<string>();

  const withIds = html.replace(
    /<h([23])>([\s\S]*?)<\/h\1>/g,
    (_m, level: string, inner: string) => {
      const text = stripTags(inner);
      let id = slugify(text) || "section";
      for (let n = 2; used.has(id); n++) id = `${slugify(text) || "section"}-${n}`;
      used.add(id);
      toc.push({ id, text, level: Number(level) as 2 | 3 });
      return `<h${level} id="${id}">${inner}</h${level}>`;
    },
  );

  return { html: withIds, toc };
}

export async function processContent(rawHtml: string): Promise<ProcessedContent> {
  const clean = sanitizeHtml(rawHtml ?? "", SANITIZE);
  const { html: withIds, toc } = addHeadingIds(clean);
  const html = await highlightCodeBlocks(withIds);
  const plainText = stripTags(clean);
  const readingMinutes = Math.max(1, Math.ceil(readingTime(plainText).minutes));

  return { html, toc, readingMinutes, plainText };
}
