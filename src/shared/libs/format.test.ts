import { describe, expect, it } from "vitest";
import { formatDate, formatDateRange, truncate, yearsSince } from "./format";

describe("formatDateRange", () => {
  it("shows Present for current roles", () => {
    expect(formatDateRange("2025-08-01T00:00:00Z", null)).toBe("Aug 2025 - Present");
  });

  it("formats finished roles in UTC", () => {
    expect(
      formatDateRange(new Date("2024-07-01T00:00:00Z"), new Date("2025-07-01T00:00:00Z")),
    ).toBe("Jul 2024 - Jul 2025");
  });
});

describe("yearsSince", () => {
  it("counts whole years only", () => {
    const now = new Date("2026-09-25T00:00:00Z");
    expect(yearsSince("2024-07-01T00:00:00Z", now)).toBe(2);
    expect(yearsSince("2024-10-01T00:00:00Z", now)).toBe(1);
    expect(yearsSince("2030-01-01T00:00:00Z", now)).toBe(0);
  });
});

describe("formatDate / truncate", () => {
  it("formats in UTC so dates never shift a day", () => {
    expect(formatDate("2026-01-15T00:00:00Z")).toBe("Jan 15, 2026");
  });

  it("truncates with an ellipsis", () => {
    expect(truncate("abcdef", 3)).toBe("abc...");
    expect(truncate("abc", 3)).toBe("abc");
  });
});
