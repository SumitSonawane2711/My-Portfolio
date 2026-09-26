"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions: string[];
  max?: number;
};

// Type and press Enter or comma to add; Backspace on an empty input removes the last tag.
export const TagInput = ({ value, onChange, suggestions, max = 8 }: TagInputProps) => {
  const [draft, setDraft] = useState("");
  const listId = useId();

  const add = (raw: string) => {
    const tag = raw.trim().replace(/,$/, "");
    if (!tag || value.length >= max) return;
    if (!value.some((t) => t.toLowerCase() === tag.toLowerCase())) onChange([...value, tag]);
    setDraft("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                onClick={() => onChange(value.filter((t) => t !== tag))}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => add(draft)}
        list={listId}
        placeholder={value.length >= max ? `Max ${max} tags` : "Add a tag…"}
        disabled={value.length >= max}
        aria-label="Add tag"
      />
      <datalist id={listId}>
        {suggestions
          .filter((s) => !value.includes(s))
          .map((s) => (
            <option key={s} value={s} />
          ))}
      </datalist>
    </div>
  );
};
