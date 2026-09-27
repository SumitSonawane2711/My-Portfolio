import type { CSSProperties } from "react";
import { cn } from "@/shared/libs/utils";
import { niceTicks, type ColumnDatum } from "@/features/admin/services/dashboardCharts";

type ColumnChartProps = {
  data: ColumnDatum[];
  /** Series in fixed order; series i always wears --chart-(i+1). */
  series: string[];
  /** Noun for the totals, e.g. "messages". */
  unit: string;
  emptyText: string;
};

const seriesColor = (i: number) => `var(--chart-${i + 1})`;
const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

// Monthly columns, stacked when there's more than one series. Plain HTML so it
// renders on the server; hover tooltips are CSS-only.
export const ColumnChart = ({ data, series, unit, emptyText }: ColumnChartProps) => {
  const totals = data.map((d) => sum(d.values));
  const grandTotal = sum(totals);
  if (grandTotal === 0) {
    return <p className="flex h-44 items-center text-sm text-muted-foreground">{emptyText}</p>;
  }

  const ticks = niceTicks(Math.max(...totals));
  const top = ticks[ticks.length - 1];
  const pct = (value: number) => `${(value / top) * 100}%`;
  const stacked = series.length > 1;
  const lastIndex = data.length - 1;

  return (
    <div>
      {stacked && (
        <ul className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {series.map((label, i) => (
            <li key={label} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm" style={{ background: seriesColor(i) }} />
              {label}
              <span className="font-medium text-foreground tabular-nums">
                {sum(data.map((d) => d.values[i]))}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2" aria-hidden>
        {/* Y axis */}
        <div className="relative h-44 w-6 shrink-0 text-right text-[11px] text-muted-foreground tabular-nums">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute right-0 translate-y-1/2 leading-none"
              style={{ bottom: pct(tick) }}
            >
              {tick}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative h-44">
            {/* Hairline gridlines; the zero line is the baseline. */}
            {ticks.map((tick) => (
              <div
                key={tick}
                className={cn(
                  "absolute inset-x-0 border-t",
                  tick === 0 ? "border-muted-foreground/40" : "border-border",
                )}
                style={{ bottom: pct(tick) }}
              />
            ))}

            <div className="absolute inset-0 flex">
              {data.map((month, index) => {
                const total = totals[index];
                const topSegment = month.values.findLastIndex((v) => v > 0);
                return (
                  <div
                    key={month.key}
                    className="group relative flex h-full flex-1 justify-center rounded-md hover:bg-muted/60"
                  >
                    <div className="flex h-full w-full max-w-6 flex-col-reverse gap-0.5">
                      {month.values.map((value, i) =>
                        value > 0 ? (
                          <div
                            key={series[i]}
                            className={cn("w-full shrink-0", i === topSegment && "rounded-t-[4px]")}
                            style={{ height: pct(value), background: seriesColor(i) }}
                          />
                        ) : null,
                      )}
                      {/* Selective direct label: only the current month's total. */}
                      {index === lastIndex && total > 0 && (
                        <span className="text-center text-[11px] leading-none font-medium tabular-nums">
                          {total}
                        </span>
                      )}
                    </div>

                    <Tooltip
                      month={month}
                      series={series}
                      total={total}
                      unit={unit}
                      align={index < 2 ? "left" : index > lastIndex - 2 ? "right" : "center"}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* X axis */}
          <div className="mt-1.5 flex text-[11px] text-muted-foreground">
            {data.map((month) => (
              <span key={month.key} className="flex-1 text-center">
                {month.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <details className="mt-3 text-xs text-muted-foreground">
        <summary className="w-fit cursor-pointer hover:text-foreground">View as table</summary>
        <table className="mt-2 w-full tabular-nums">
          <thead>
            <tr className="border-b text-left">
              <th className="py-1 font-medium">Month</th>
              {stacked &&
                series.map((label) => (
                  <th key={label} className="py-1 font-medium">
                    {label}
                  </th>
                ))}
              <th className="py-1 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((month, index) => (
              <tr key={month.key} className="border-b last:border-0">
                <td className="py-1">{month.fullLabel}</td>
                {stacked &&
                  month.values.map((value, i) => (
                    <td key={series[i]} className="py-1">
                      {value}
                    </td>
                  ))}
                <td className="py-1 text-right text-foreground">{totals[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
};

type TooltipProps = {
  month: ColumnDatum;
  series: string[];
  total: number;
  unit: string;
  align: "left" | "center" | "right";
};

const ALIGN: Record<TooltipProps["align"], CSSProperties> = {
  left: { left: 0 },
  center: { left: "50%", transform: "translateX(-50%)" },
  right: { right: 0 },
};

// Anchored at the top of the plot: the card clips anything outside it.
const Tooltip = ({ month, series, total, unit, align }: TooltipProps) => (
  <div
    className="pointer-events-none absolute top-0 z-10 min-w-36 rounded-lg bg-popover px-2.5 py-2 text-xs whitespace-nowrap text-popover-foreground opacity-0 shadow-md ring-1 ring-foreground/10 transition-opacity group-hover:opacity-100"
    style={ALIGN[align]}
  >
    <p className="mb-1 font-medium">{month.fullLabel}</p>
    {series.length > 1 &&
      series.map((label, i) => (
        <p key={label} className="flex items-center gap-1.5 text-muted-foreground">
          <span className="size-2 rounded-sm" style={{ background: seriesColor(i) }} />
          {label}
          <span className="ml-auto pl-3 text-popover-foreground tabular-nums">
            {month.values[i]}
          </span>
        </p>
      ))}
    <p className={cn("flex text-muted-foreground", series.length > 1 && "mt-1 border-t pt-1")}>
      Total {unit}
      <span className="ml-auto pl-3 font-medium text-popover-foreground tabular-nums">{total}</span>
    </p>
  </div>
);
