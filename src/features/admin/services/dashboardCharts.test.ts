import { describe, expect, it } from "vitest";
import { buildDashboardCharts, chartsSince, monthBuckets, niceTicks } from "./dashboardCharts";

const now = new Date("2026-03-15T10:00:00Z");

describe("monthBuckets", () => {
  it("returns the last six months, oldest first, across a year boundary", () => {
    const buckets = monthBuckets(now);
    expect(buckets.map((b) => b.key)).toEqual([
      "2025-10",
      "2025-11",
      "2025-12",
      "2026-01",
      "2026-02",
      "2026-03",
    ]);
    expect(buckets[5]).toMatchObject({ label: "Mar", fullLabel: "March 2026" });
    expect(chartsSince(now).toISOString()).toBe("2025-10-01T00:00:00.000Z");
  });
});

describe("buildDashboardCharts", () => {
  it("counts rows per month and ignores rows outside the range", () => {
    const charts = buildDashboardCharts(
      {
        messages: [
          { createdAt: new Date("2026-03-01T00:00:00Z") },
          { createdAt: new Date("2026-03-31T23:59:59Z") },
          { createdAt: new Date("2025-10-02T00:00:00Z") },
          { createdAt: new Date("2025-09-30T23:59:59Z") },
        ],
        stories: [{ publishedAt: new Date("2026-02-10T00:00:00Z") }],
        resumes: [{ title: "Old", downloadCount: 3, status: "ARCHIVED" }],
      },
      now,
    );

    expect(charts.messagesByMonth[5].values).toEqual([2]);
    expect(charts.messagesByMonth[0].values).toEqual([1]);
    expect(charts.messagesByMonth.flatMap((m) => m.values).reduce((a, b) => a + b)).toBe(3);
    expect(charts.storiesByMonth[4].values).toEqual([1]);
    expect(charts.resumeDownloads).toEqual([{ label: "Old", value: 3, note: "archived" }]);
  });
});

describe("niceTicks", () => {
  it("rounds the axis up to clean steps", () => {
    expect(niceTicks(0)).toEqual([0, 1]);
    expect(niceTicks(3)).toEqual([0, 1, 2, 3]);
    expect(niceTicks(7)).toEqual([0, 2, 4, 6, 8]);
    expect(niceTicks(37)).toEqual([0, 10, 20, 30, 40]);
  });
});
