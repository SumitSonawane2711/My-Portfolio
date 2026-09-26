import type { BarDatum } from "@/features/admin/services/dashboardCharts";

type BarListProps = {
  data: BarDatum[];
  emptyText: string;
};

// Ranked horizontal bars, one series (--chart-1). Every value is printed at the
// bar's tip, so the list doubles as its own table.
export const BarList = ({ data, emptyText }: BarListProps) => {
  if (data.length === 0) {
    return <p className="py-6 text-sm text-muted-foreground">{emptyText}</p>;
  }

  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <ul className="space-y-1">
      {data.map((item, index) => (
        <li
          key={`${item.label}-${index}`}
          title={`${item.label}: ${item.value}`}
          className="grid grid-cols-[minmax(0,11rem)_1fr] items-center gap-3 rounded-md px-1.5 py-1.5 hover:bg-muted/60"
        >
          <span className="flex min-w-0 items-center gap-1.5 text-sm">
            <span className="truncate">{item.label}</span>
            {item.note && (
              <span className="shrink-0 text-[11px] text-muted-foreground">({item.note})</span>
            )}
          </span>
          <span className="flex items-center gap-2">
            {item.value > 0 && (
              <span
                className="h-3 rounded-r-[4px] bg-(--chart-1)"
                style={{ width: `calc((100% - 2.5rem) * ${item.value / max})` }}
              />
            )}
            <span className="text-xs font-medium tabular-nums">{item.value}</span>
          </span>
        </li>
      ))}
    </ul>
  );
};
