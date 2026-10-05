import { Skeleton } from "@/shared/components/ui/skeleton";

// Shown inside the dashboard shell (sidebar and top bar stay) while a page loads.
export default function AdminLoading() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="flex-1">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="mt-2 h-4 w-full max-w-md" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="divide-y rounded-lg border">
        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} className="flex items-center gap-3 p-3">
            <Skeleton className="h-12 w-16 shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="mt-2 h-3 w-1/4" />
            </div>
            <Skeleton className="size-8" />
            <Skeleton className="size-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
