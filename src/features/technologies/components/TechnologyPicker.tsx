"use client";

import { Checkbox } from "@/shared/components/ui/checkbox";
import { TechBadgeIcon } from "@/shared/components/TechBadgeIcon";
import type { TechnologyAdminRow } from "../interfaces/technology";

type TechnologyPickerProps = {
  options: TechnologyAdminRow[];
  value: string[];
  onChange: (ids: string[]) => void;
};

// Checkbox grid of technologies (with their icons) for project/experience forms.
export const TechnologyPicker = ({ options, value, onChange }: TechnologyPickerProps) => {
  if (options.length === 0) {
    return <p className="text-sm text-muted-foreground">Add technologies first.</p>;
  }

  const toggle = (id: string, checked: boolean) =>
    onChange(checked ? [...value, id] : value.filter((v) => v !== id));

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((tech) => (
        <label
          key={tech.id}
          className="flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-sm has-data-[state=checked]:bg-muted"
        >
          <Checkbox
            checked={value.includes(tech.id)}
            onCheckedChange={(checked) => toggle(tech.id, checked === true)}
          />
          <TechBadgeIcon tech={tech} />
          <span className="truncate">{tech.name}</span>
        </label>
      ))}
    </div>
  );
};
