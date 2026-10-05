import { decodeEntities } from "@/shared/libs/content/entities";

// Pure helpers for Medium's RSS feed (no network, no database) — unit tested.
// Medium only serves the latest ~10 stories in the feed; older ones are added
// by hand in admin.

export type FeedStory = {
  guid: string;
  url: string;
  title: string;
  excerpt: string;
  coverUrl: string | null;
  tags: string[];
  publishedAt: Date;
};

/**
 * The RSS URL for a Medium profile link from Settings → Socials:
 *   https://medium.com/@user        → https://medium.com/feed/@user
 *   https://medium.com/publication  → https://medium.com/feed/publication
 *   https://user.medium.com         → https://user.medium.com/feed
 *   https://blog.example.com        → https://blog.example.com/feed (custom domain)
 */
export function mediumFeedUrl(profileUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(profileUrl.trim());
  } catch {
    return null;
  }
  if (url.hostname === "medium.com" || url.hostname === "www.medium.com") {
    const first = url.pathname.split("/").find(Boolean);
    return first ? `https://medium.com/feed/${first}` : null;
  }
  return `${url.origin}/feed`;
}

/**
 * Medium's stable story id, from any story URL:
 *   https://medium.com/@user/my-title-62edea66ffa4?source=…  → https://medium.com/p/62edea66ffa4
 *   https://medium.com/p/62edea66ffa4                        → https://medium.com/p/62edea66ffa4
 * The RSS guid has the same form, so a story added by hand and later seen in
 * the feed is one row, not two.
 */
export function mediumStoryGuid(storyUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(storyUrl.trim());
  } catch {
    return null;
  }
  const match = url.pathname.match(/(?:^\/p\/|-)([0-9a-f]{8,16})\/?$/);
  return match ? `https://medium.com/p/${match[1]}` : null;
}

/** Drops Medium's `?source=rss-…` tracking query and any fragment. */
export const cleanStoryUrl = (raw: string) => {
  const url = new URL(raw.trim());
  url.search = "";
  url.hash = "";
  return url.toString();
};

/** First ~160 characters of the text, cut at a word boundary. */
export function excerptFrom(plainText: string, max = 160) {
  const text = plainText.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return `${cut.slice(0, space > 80 ? space : max).trim()}…`;
}

// Text of the first <name>…</name>, unwrapping CDATA (entities only outside it).
function readTag(xml: string, name: string) {
  const match = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
  if (!match) return "";
  return readText(match[1]);
}

function readText(raw: string) {
  const cdata = raw.trim().match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  return cdata ? cdata[1].trim() : decodeEntities(raw.trim());
}

// The story's first real image. Medium appends a 1×1 tracking pixel
// (medium.com/_/stat?…) to every story, which must never become the cover.
function firstImage(html: string) {
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    if (!src || src.includes("/_/stat") || /\bwidth="1"/.test(tag)) continue;
    return decodeEntities(src);
  }
  return null;
}

const squash = (text: string) => text.replace(/\s+/g, " ").trim();

const BLOCK_TAG = /<\/?(?:p|h[1-6]|li|ul|ol|blockquote|div|br|hr)\b[^>]*>/gi;

// Block boundaries become spaces; inline tags (<a>, <em>, …) vanish, so
// "our <a>Rules</a>." reads "our Rules." and not "our Rules .".
const htmlToText = (html: string) =>
  squash(decodeEntities(html.replace(BLOCK_TAG, " ").replace(/<[^>]*>/g, "")));

// Plain text of the body, without the title Medium repeats as the first
// heading, image captions or code.
function storyText(html: string, title: string) {
  const body = html
    .replace(/<figure\b[\s\S]*?<\/figure>/g, " ")
    .replace(/<pre\b[\s\S]*?<\/pre>/g, " ")
    .replace(/^\s*<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/, (heading, inner: string) =>
      htmlToText(inner) === squash(title) ? " " : heading,
    );
  return htmlToText(body);
}

/** Parses Medium's RSS XML. Items without a title, link or valid date are skipped. */
export function parseMediumFeed(xml: string): FeedStory[] {
  const stories: FeedStory[] = [];
  for (const [, item] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const title = readTag(item, "title");
    const link = readTag(item, "link");
    const publishedAt = new Date(readTag(item, "pubDate"));
    if (!title || !link || Number.isNaN(publishedAt.getTime())) continue;

    const url = cleanStoryUrl(link);
    const content = readTag(item, "content:encoded");
    stories.push({
      guid: readTag(item, "guid") || mediumStoryGuid(url) || url,
      url,
      title,
      excerpt: excerptFrom(storyText(content, title)),
      coverUrl: firstImage(content),
      tags: [...item.matchAll(/<category>([\s\S]*?)<\/category>/g)].map(([, t]) => readText(t)),
      publishedAt,
    });
  }
  return stories;
}

/**
 * Asks Medium's image CDN for a smaller rendition:
 *   cdn-images-1.medium.com/max/1024/…    → /max/{width}/…
 *   miro.medium.com/v2/resize:fit:1024/…  → resize:fit:{width}/…
 * Other hosts are returned unchanged.
 */
export function mediumImage(url: string, width: number) {
  return url
    .replace(/(cdn-images-\d\.medium\.com\/max\/)\d+\//, `$1${width}/`)
    .replace(/(miro\.medium\.com\/v2\/resize:fit:)\d+\//, `$1${width}/`);
}
