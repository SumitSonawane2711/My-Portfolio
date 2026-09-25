"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { cn } from "@/shared/libs/utils";
import { searchIconsAction } from "../actions/technologyActions";

type IconPickerProps = {
  value: string | null;
  onChange: (key: string | null) => void;
  /** Pre-rendered SVG of the current value (from the server), for the preview. */
  selectedSvg?: string | null;
  initialQuery?: string;
};

type Result = { key: string; svg: string };

export const IconPicker = ({
  value,
  onChange,
  selectedSvg,
  initialQuery = "",
}: IconPickerProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(selectedSvg ?? null);
  const debounced = useDebouncedValue(query, 300);

  useEffect(() => {
    if (debounced.trim().length < 2) return;
    let cancelled = false;
    // Loading state is set by the (async) callback chain, not synchronously in the effect.
    Promise.resolve()
      .then(() => {
        if (!cancelled) setLoading(true);
        return searchIconsAction(debounced);
      })
      .then((result) => {
        if (!cancelled && result.ok) setResults(result.data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const visible = debounced.trim().length < 2 ? [] : results;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border [&>span>svg]:h-5 [&>span>svg]:w-5">
          {value && preview ? <span dangerouslySetInnerHTML={{ __html: preview }} /> : null}
        </div>
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons (e.g. react, postgres)"
            className="pl-8"
          />
        </div>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Clear icon"
            onClick={() => {
              onChange(null);
              setPreview(null);
            }}
          >
            <X />
          </Button>
        )}
      </div>
      {value && <p className="text-xs text-muted-foreground">Selected: {value}</p>}

      {loading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
      {visible.length > 0 && (
        <div className="grid max-h-56 grid-cols-6 gap-1 overflow-y-auto rounded-md border p-1 sm:grid-cols-8">
          {visible.map((icon) => (
            <button
              key={icon.key}
              type="button"
              title={icon.key}
              aria-label={icon.key}
              aria-pressed={icon.key === value}
              onClick={() => {
                onChange(icon.key);
                setPreview(icon.svg);
              }}
              className={cn(
                "flex aspect-square items-center justify-center rounded p-1.5 hover:bg-muted [&>svg]:h-6 [&>svg]:w-6",
                icon.key === value && "bg-muted ring-2 ring-ring",
              )}
              dangerouslySetInnerHTML={{ __html: icon.svg }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
