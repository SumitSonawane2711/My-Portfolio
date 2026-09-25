import { describe, expect, it } from "vitest";
import { excerptFrom, isVisible, PublishRuleError, resolvePublishState } from "./publishRules";

const now = new Date("2026-09-25T12:00:00Z");
const past = new Date("2026-09-01T00:00:00Z");
const future = new Date("2026-10-01T00:00:00Z");

describe("resolvePublishState", () => {
  it("keeps drafts as drafts (and their earlier date)", () => {
    expect(resolvePublishState({ status: "DRAFT", publishedAt: null }, past, now)).toEqual({
      status: "DRAFT",
      publishedAt: past,
    });
  });

  it("publishes now when no date is given", () => {
    expect(resolvePublishState({ status: "PUBLISHED", publishedAt: null }, null, now)).toEqual({
      status: "PUBLISHED",
      publishedAt: now,
    });
  });

  it("keeps the original date when re-publishing", () => {
    expect(
      resolvePublishState({ status: "PUBLISHED", publishedAt: null }, past, now).publishedAt,
    ).toBe(past);
  });

  it("turns a future-dated publish into a scheduled post", () => {
    expect(
      resolvePublishState({ status: "PUBLISHED", publishedAt: future }, null, now).status,
    ).toBe("SCHEDULED");
  });

  it("requires a future date to schedule", () => {
    expect(() =>
      resolvePublishState({ status: "SCHEDULED", publishedAt: null }, null, now),
    ).toThrow(PublishRuleError);
    expect(() =>
      resolvePublishState({ status: "SCHEDULED", publishedAt: past }, null, now),
    ).toThrow(PublishRuleError);
  });
});

describe("isVisible", () => {
  it("hides drafts and not-yet-due scheduled posts", () => {
    expect(isVisible({ status: "DRAFT", publishedAt: past }, now)).toBe(false);
    expect(isVisible({ status: "SCHEDULED", publishedAt: future }, now)).toBe(false);
  });

  it("shows published posts and scheduled posts whose time has come", () => {
    expect(isVisible({ status: "PUBLISHED", publishedAt: past }, now)).toBe(true);
    expect(isVisible({ status: "SCHEDULED", publishedAt: past }, now)).toBe(true);
  });
});

describe("excerptFrom", () => {
  it("cuts long text at a word boundary with an ellipsis", () => {
    const excerpt = excerptFrom("word ".repeat(100), 50);
    expect(excerpt.length).toBeLessThanOrEqual(51);
    expect(excerpt.endsWith("…")).toBe(true);
  });

  it("returns short text unchanged", () => {
    expect(excerptFrom("  short   text ")).toBe("short text");
  });
});
