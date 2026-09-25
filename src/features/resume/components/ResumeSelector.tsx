import Link from "next/link";
import { cn } from "@/shared/libs/utils";
import type { PublicResume } from "../interfaces/resume";

// Segmented control between active resumes. Plain links to static pages, so
// switching needs no client JavaScript.
export const ResumeSelector = ({
  options,
  selected,
}: {
  options: PublicResume[];
  selected: string;
}) => {
  return (
    <nav
      aria-label="Choose a resume"
      className="mb-4 inline-flex flex-wrap gap-1 rounded-full border border-neutral-200 p-1 dark:border-neutral-700"
    >
      {options.map((option) => {
        const active = option.slug === selected;
        return (
          <Link
            key={option.slug}
            href={`/resume/${option.slug}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm transition-colors",
              active
                ? "bg-primary font-medium text-white dark:text-neutral-950"
                : "text-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800",
            )}
          >
            {option.title}
          </Link>
        );
      })}
    </nav>
  );
};
