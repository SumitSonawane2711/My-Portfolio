import { describe, expect, it } from "vitest";
import { deserialize, serialize } from "./dataCache";

describe("data cache serialization", () => {
  it("keeps Dates as Dates, nested in arrays and objects", () => {
    const value = {
      title: "Story",
      publishedAt: new Date("2026-06-28T18:01:22.039Z"),
      items: [{ updatedAt: new Date("2026-01-01T00:00:00Z"), tags: ["a"] }],
      empty: null,
    };
    const restored = deserialize<typeof value>(serialize(value));
    expect(restored).toEqual(value);
    expect(restored.publishedAt).toBeInstanceOf(Date);
    expect(restored.items[0].updatedAt).toBeInstanceOf(Date);
  });

  it("leaves date-like strings alone", () => {
    const value = { label: "2026-06-28T18:01:22.039Z" };
    expect(deserialize(serialize(value))).toEqual(value);
  });
});
