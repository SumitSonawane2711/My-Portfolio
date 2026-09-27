import type { MessageKind } from "@/generated/prisma/client";

// Pure shaping for the overview charts (no database access), so it's unit-tested.
// Months are UTC calendar months, like every other date in the app.

export const CHART_MONTHS = 6;

// Fixed order = fixed color per kind, whatever the counts are.
export const MESSAGE_KINDS: { kind: MessageKind; label: string }[] = [
  { kind: "CONTACT", label: "Contact" },
  { kind: "SUGGESTION", label: "Suggestion" },
  { kind: "CORRECTION", label: "Correction" },
  { kind: "THOUGHT", label: "Thought" },
];

export type MonthBucket = { key: string; label: string; fullLabel: string };

export type ColumnDatum = MonthBucket & { values: number[] };

export type BarDatum = { label: string; value: number; note?: string };

const monthKey = (date: Date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

// First instant of the oldest month shown.
export const chartsSince = (now: Date, months = CHART_MONTHS) =>
  new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1), 1));

// The last `months` calendar months, oldest first, ending with the current one.
export function monthBuckets(now: Date, months = CHART_MONTHS): MonthBucket[] {
  return Array.from({ length: months }, (_, i) => {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1) + i, 1));
    return {
      key: monthKey(date),
      label: date.toLocaleDateString("en-us", { month: "short", timeZone: "UTC" }),
      fullLabel: date.toLocaleDateString("en-us", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
    };
  });
}

// Counts rows per month and per series. `seriesOf` returns the series index.
export function countByMonth<T extends { createdAt: Date }>(
  rows: T[],
  buckets: MonthBucket[],
  seriesCount: number,
  seriesOf: (row: T) => number = () => 0,
): ColumnDatum[] {
  const index = new Map(buckets.map((bucket, i) => [bucket.key, i]));
  const data = buckets.map((bucket) => ({ ...bucket, values: Array<number>(seriesCount).fill(0) }));
  for (const row of rows) {
    const i = index.get(monthKey(row.createdAt));
    const series = seriesOf(row);
    if (i !== undefined && series >= 0) data[i].values[series]++;
  }
  return data;
}

type ChartRows = {
  messages: { kind: MessageKind; createdAt: Date }[];
  likes: { createdAt: Date }[];
  resumes: { title: string; downloadCount: number; status: string }[];
  likedPosts: { title: string; _count: { likes: number } }[];
};

export function buildDashboardCharts(rows: ChartRows, now: Date) {
  const buckets = monthBuckets(now);
  const kindIndex = new Map(MESSAGE_KINDS.map(({ kind }, i) => [kind, i]));

  return {
    messagesByMonth: countByMonth(
      rows.messages,
      buckets,
      MESSAGE_KINDS.length,
      (message) => kindIndex.get(message.kind) ?? -1,
    ),
    likesByMonth: countByMonth(rows.likes, buckets, 1),
    resumeDownloads: rows.resumes.map<BarDatum>((resume) => ({
      label: resume.title,
      value: resume.downloadCount,
      note: resume.status === "ACTIVE" ? undefined : resume.status.toLowerCase(),
    })),
    topLikedPosts: rows.likedPosts.map<BarDatum>((post) => ({
      label: post.title,
      value: post._count.likes,
    })),
  };
}

export type DashboardCharts = ReturnType<typeof buildDashboardCharts>;

// Clean axis ticks (0, 2, 4 … / 0, 5, 10 …) covering `max`, about four steps.
export function niceTicks(max: number, target = 4): number[] {
  if (max <= 0) return [0, 1];
  const raw = max / target;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? magnitude * 10;
  const niceStep = Math.max(1, step);
  const top = Math.ceil(max / niceStep) * niceStep;
  return Array.from({ length: top / niceStep + 1 }, (_, i) => i * niceStep);
}
