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
      className="mb-4 inline-flex flex-wrap gap-1 rounded-lg border border-card-edge p-1"
    >
      {options.map((option) => {
        const active = option.slug === selected;
        return (
          <Link
            key={option.slug}
            href={`/resume/${option.slug}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors duration-200",
              active
                ? "bg-amber-900/10 font-medium text-foreground dark:bg-orange-900/40"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.title}
          </Link>
        );
      })}
    </nav>
  );
};
