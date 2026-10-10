"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { IconCheck, IconChevronDown, IconSearch } from "@tabler/icons-react";
import type { CountryCode } from "libphonenumber-js/mobile";
import { cn } from "@/shared/libs/utils";

export type CountryOption = { code: CountryCode; dial: string; name: string };

type CountrySelectProps = {
  options: CountryOption[];
  value: CountryCode;
  onChange: (code: CountryCode) => void;
  /** Classes for the trigger (match the form's inputs). */
  className?: string;
};

// The calling-code picker beside the phone number: a button showing "IN +91"
// that opens a searchable list. Its own colours for light and dark, so the
// list stays readable on every page (a native <select> popup can come out as
// white text on white in dark mode). Keyboard: arrows, Enter, Escape.
export const CountrySelect = ({ options, value, onChange, className }: CountrySelectProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.code === value);
  const term = query.trim().toLowerCase().replace(/^\+/, "");
  const filtered = term
    ? options.filter(
        (o) =>
          o.name.toLowerCase().includes(term) ||
          o.code.toLowerCase() === term ||
          o.dial.startsWith(term),
      )
    : options;

  const show = () => {
    setQuery("");
    setActive(
      Math.max(
        0,
        options.findIndex((o) => o.code === value),
      ),
    );
    setOpen(true);
  };
  const close = (focusTrigger = false) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };
  const pick = (option: CountryOption | undefined) => {
    if (!option) return;
    onChange(option.code);
    close(true);
  };

  // A click anywhere else closes the list.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Keep the highlighted option in view.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onSearchKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      pick(filtered[active]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    }
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Country code: ${selected?.name ?? value} (+${selected?.dial ?? ""})`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? close() : show())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            show();
          }
        }}
        className={cn("flex h-full items-center gap-1.5 tabular-nums", className)}
      >
        {value} +{selected?.dial}
        <IconChevronDown
          aria-hidden
          className={cn("size-3.5 opacity-60 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-72 max-w-[calc(100vw-3rem)] overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-900 shadow-lg dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
          <div className="flex items-center gap-2 border-b border-neutral-200 px-3 dark:border-neutral-700">
            <IconSearch aria-hidden className="size-4 shrink-0 text-neutral-400" />
            <input
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={onSearchKey}
              placeholder="Search country or code"
              aria-label="Search country or code"
              aria-controls={listId}
              aria-activedescendant={
                filtered[active] ? `${listId}-${filtered[active].code}` : undefined
              }
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </div>
          <ul
            id={listId}
            ref={listRef}
            role="listbox"
            aria-label="Countries"
            className="max-h-60 overflow-y-auto py-1"
          >
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-neutral-500">No country found</li>
            )}
            {filtered.map((option, index) => {
              const isSelected = option.code === value;
              return (
                <li
                  key={option.code}
                  id={`${listId}-${option.code}`}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActive(index)}
                  onMouseDown={(event) => event.preventDefault()} // keep focus in the search
                  onClick={() => pick(option)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                    index === active && "bg-neutral-100 dark:bg-neutral-800",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{option.name}</span>
                  <span className="text-neutral-500 tabular-nums dark:text-neutral-400">
                    +{option.dial}
                  </span>
                  <IconCheck
                    aria-hidden
                    className={cn("size-4 shrink-0", isSelected ? "opacity-100" : "opacity-0")}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
