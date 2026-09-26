import type { TocItem } from "@/shared/libs/content/process";
import { cn } from "@/shared/libs/utils";

// Anchor links to the article's h2/h3 headings. Hidden for short posts.
export const TableOfContents = ({ items }: { items: TocItem[] }) => {
  if (items.length < 3) return null;

  return (
    <details
      open
      className="mb-8 rounded-lg border border-neutral-200 p-4 text-sm dark:border-neutral-800"
    >
      <summary className="cursor-pointer font-semibold text-primary">On this page</summary>
      <ol className="mt-3 flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.id} className={cn(item.level === 3 && "pl-4")}>
            <a href={`#${item.id}`} className="text-secondary hover:text-primary">
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
};
