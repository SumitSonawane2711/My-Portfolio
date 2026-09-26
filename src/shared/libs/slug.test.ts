import { describe, expect, it } from "vitest";
import { SLUG_PATTERN, slugify, uniqueSlug } from "./slug";

describe("slugify", () => {
  it("lowercases, strips accents and symbols, and dashes words", () => {
    expect(slugify("Hello, World! — Ça va?")).toBe("hello-world-ca-va");
  });

  it("cleans up the old blog file name", () => {
    expect(slugify("Adopting-AI-Agents.")).toBe("adopting-ai-agents");
  });

  it("caps the length at 80 without a trailing dash", () => {
    const slug = slugify(`${"word ".repeat(40)}`);
    expect(slug.length).toBeLessThanOrEqual(80);
    expect(slug.endsWith("-")).toBe(false);
    expect(SLUG_PATTERN.test(slug)).toBe(true);
  });
});

describe("uniqueSlug", () => {
  it("adds -2, -3… until the slug is free", async () => {
    const taken = new Set(["my-post", "my-post-2"]);
    expect(await uniqueSlug("My Post", async (s) => taken.has(s))).toBe("my-post-3");
  });

  it("falls back to 'item' for empty input", async () => {
    expect(await uniqueSlug("!!!", async () => false)).toBe("item");
  });
});
