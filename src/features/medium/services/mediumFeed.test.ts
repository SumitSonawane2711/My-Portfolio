import { describe, expect, it } from "vitest";
import {
  excerptFrom,
  mediumFeedUrl,
  mediumImage,
  mediumStoryGuid,
  parseMediumFeed,
} from "./mediumFeed";

// Trimmed copy of a real Medium feed item (structure kept as Medium sends it).
const FEED = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel>
<title><![CDATA[Stories by Sumit on Medium]]></title>
<link>https://medium.com/@sumit?source=rss-abc------2</link>
<item>
  <title><![CDATA[Building a pnpm Monorepo & Shipping It]]></title>
  <link>https://medium.com/@sumit/building-a-pnpm-monorepo-62edea66ffa4?source=rss-abc------2</link>
  <guid isPermaLink="false">https://medium.com/p/62edea66ffa4</guid>
  <category><![CDATA[pnpm]]></category>
  <category><![CDATA[nextjs]]></category>
  <pubDate>Wed, 28 Jun 2023 18:01:22 GMT</pubDate>
  <content:encoded><![CDATA[<h3>Building a pnpm Monorepo &amp; Shipping It</h3><figure><img alt="" src="https://cdn-images-1.medium.com/max/1024/1*cover.png" /><figcaption>A caption</figcaption></figure><p>One repo, three apps &amp; a shared package.</p><pre>npm i</pre><p>Second paragraph.</p><img src="https://medium.com/_/stat?event=post.clientViewed&amp;referrerSource=full_rss&amp;postId=62edea66ffa4" width="1" height="1" alt="">]]></content:encoded>
</item>
<item>
  <title><![CDATA[No date]]></title>
  <link>https://medium.com/@sumit/no-date-111111111111</link>
</item>
<item>
  <title><![CDATA[Text only]]></title>
  <link>https://medium.com/@sumit/text-only-aaaaaaaaaaaa?source=rss</link>
  <guid isPermaLink="false">https://medium.com/p/aaaaaaaaaaaa</guid>
  <pubDate>Mon, 01 Jan 2024 10:00:00 GMT</pubDate>
  <content:encoded><![CDATA[<p>Just words.</p><img src="https://medium.com/_/stat?event=x" width="1" height="1" alt="">]]></content:encoded>
</item>
</channel></rss>`;

describe("parseMediumFeed", () => {
  const [story, textOnly, ...rest] = parseMediumFeed(FEED);

  it("reads a story and cleans the link", () => {
    expect(story).toMatchObject({
      guid: "https://medium.com/p/62edea66ffa4",
      url: "https://medium.com/@sumit/building-a-pnpm-monorepo-62edea66ffa4",
      title: "Building a pnpm Monorepo & Shipping It",
      tags: ["pnpm", "nextjs"],
      coverUrl: "https://cdn-images-1.medium.com/max/1024/1*cover.png",
    });
    expect(story.publishedAt.toISOString()).toBe("2023-06-28T18:01:22.000Z");
  });

  it("builds the excerpt without the repeated title, captions or code", () => {
    expect(story.excerpt).toBe("One repo, three apps & a shared package. Second paragraph.");
  });

  it("never uses the tracking pixel as a cover and skips items without a date", () => {
    expect(textOnly.coverUrl).toBeNull();
    expect(textOnly.excerpt).toBe("Just words.");
    expect(rest).toHaveLength(0);
  });
});

describe("mediumFeedUrl", () => {
  it.each([
    ["https://medium.com/@sumit", "https://medium.com/feed/@sumit"],
    ["https://medium.com/@sumit/", "https://medium.com/feed/@sumit"],
    ["https://medium.com/my-publication", "https://medium.com/feed/my-publication"],
    ["https://sumit.medium.com", "https://sumit.medium.com/feed"],
    ["https://blog.example.com/", "https://blog.example.com/feed"],
  ])("%s → %s", (profile, feed) => {
    expect(mediumFeedUrl(profile)).toBe(feed);
  });

  it("rejects links it can't use", () => {
    expect(mediumFeedUrl("not a url")).toBeNull();
    expect(mediumFeedUrl("https://medium.com/")).toBeNull();
  });
});

describe("mediumStoryGuid", () => {
  it("finds the story id in any story URL", () => {
    expect(mediumStoryGuid("https://medium.com/@sumit/my-title-62edea66ffa4?source=x")).toBe(
      "https://medium.com/p/62edea66ffa4",
    );
    expect(mediumStoryGuid("https://sumit.medium.com/my-title-62edea66ffa4")).toBe(
      "https://medium.com/p/62edea66ffa4",
    );
    expect(mediumStoryGuid("https://medium.com/p/62edea66ffa4")).toBe(
      "https://medium.com/p/62edea66ffa4",
    );
    expect(mediumStoryGuid("https://medium.com/@sumit")).toBeNull();
  });
});

describe("excerptFrom", () => {
  it("cuts long text at a word boundary", () => {
    const text = "word ".repeat(60);
    const excerpt = excerptFrom(text);
    expect(excerpt.length).toBeLessThanOrEqual(161);
    expect(excerpt.endsWith("word…")).toBe(true);
  });
});

describe("mediumImage", () => {
  it("requests a smaller rendition from Medium's CDN", () => {
    expect(mediumImage("https://cdn-images-1.medium.com/max/1024/1*a.png", 400)).toBe(
      "https://cdn-images-1.medium.com/max/400/1*a.png",
    );
    expect(mediumImage("https://miro.medium.com/v2/resize:fit:1200/1*a.png", 400)).toBe(
      "https://miro.medium.com/v2/resize:fit:400/1*a.png",
    );
    expect(mediumImage("https://example.com/a.png", 400)).toBe("https://example.com/a.png");
  });
});
