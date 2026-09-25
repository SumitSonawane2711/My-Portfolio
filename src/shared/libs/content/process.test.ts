import { describe, expect, it } from "vitest";
import { escapeHtml } from "./entities";
import { processContent } from "./process";

describe("processContent", () => {
  it("strips scripts, event handlers, inline styles and javascript: links", async () => {
    const { html } = await processContent(
      `<p onclick="x()" style="color:red">Hi <a href="javascript:alert(1)">bad</a></p><script>alert(1)</script><iframe src="https://x"></iframe>`,
    );
    expect(html).not.toMatch(/onclick|style=|<script|<iframe|javascript:/);
    expect(html).toContain("<p>Hi <a>bad</a></p>");
  });

  it("only keeps images from Cloudinary or this site", async () => {
    const { html } = await processContent(
      `<img src="https://evil.example/x.png"><img src="https://res.cloudinary.com/demo/image/upload/a.jpg"><img src="/local.png">`,
    );
    expect(html).not.toContain("evil.example");
    expect(html).toContain("res.cloudinary.com");
    expect(html).toContain('src="/local.png"');
    expect(html).toContain('loading="lazy"');
  });

  it("marks external links and demotes h1 to h2", async () => {
    const { html } = await processContent(`<h1>Title</h1><p><a href="https://x.dev">x</a></p>`);
    expect(html).toContain('<h2 id="title">Title</h2>');
    expect(html).toContain('rel="noopener noreferrer nofollow"');
  });

  it("builds a table of contents with unique ids", async () => {
    const { toc } = await processContent(`<h2>Intro</h2><h2>Intro</h2><h3>Sub &amp; more</h3>`);
    expect(toc).toEqual([
      { id: "intro", text: "Intro", level: 2 },
      { id: "intro-2", text: "Intro", level: 2 },
      { id: "sub-more", text: "Sub & more", level: 3 },
    ]);
  });

  it("highlights code with light and dark colors", async () => {
    const { html } = await processContent(
      `<pre><code class="language-ts">const a: number = 1;</code></pre>`,
    );
    expect(html).toContain('class="shiki');
    expect(html).toContain("--shiki-dark");
  });

  it("reports at least one minute of reading time", async () => {
    expect((await processContent("<p>short</p>")).readingMinutes).toBe(1);
  });
});

describe("escapeHtml", () => {
  it("escapes everything that could become markup", () => {
    expect(escapeHtml(`<b onclick="x">'&'</b>`)).toBe(
      "&lt;b onclick=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/b&gt;",
    );
  });
});
