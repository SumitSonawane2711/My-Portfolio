import { describe, expect, it } from "vitest";
import { decorateCodeBlocks } from "./codeBlocks";
import { processContent } from "./process";

describe("code blocks", () => {
  it("records the language when highlighting", async () => {
    const { html } = await processContent(
      `<pre><code class="language-ts">const a = 1;</code></pre>`,
    );
    expect(html).toContain('data-language="typescript"');
  });

  it("wraps highlighted blocks in an editor frame with the language name", async () => {
    const { html } = await processContent(
      `<p>Intro</p><pre><code class="language-tsx">const a = 1;</code></pre>`,
    );
    const out = decorateCodeBlocks(html);
    expect(out).toContain('<figure class="code-block not-prose">');
    expect(out).toContain('<span class="code-block-lang">TSX</span>');
    expect(out).toContain("data-copy-code");
    expect(out).toContain("<p>Intro</p>");
  });

  it("labels older blocks without a language as Code", () => {
    const out = decorateCodeBlocks(
      `<pre class="shiki github-light" tabindex="0"><code>x</code></pre>`,
    );
    expect(out).toContain('<span class="code-block-lang">Code</span>');
  });

  it("leaves content without code untouched", () => {
    expect(decorateCodeBlocks("<p>No code</p>")).toBe("<p>No code</p>");
  });
});
