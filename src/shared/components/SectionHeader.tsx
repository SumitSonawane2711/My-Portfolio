import { ArrowLink } from "./ArrowLink";

type SectionHeaderProps = {
  /** Also the section's accessible name: pair with aria-labelledby={id}. */
  id: string;
  title: string;
  /** The subtitle; may hold one <span className="highlight">. */
  description?: React.ReactNode;
  action?: { href: string; label: string; external?: boolean };
};

// A section heading with a grey subtitle and an optional "see all" link.
export const SectionHeader = ({ id, title, description, action }: SectionHeaderProps) => {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div>
        <h2 id={id} className="text-2xl font-medium tracking-tight text-primary sm:text-[28px]">
          {title}
        </h2>
        {description && <p className="mt-1 text-gray-600 dark:text-gray-400">{description}</p>}
      </div>
      {action && (
        <ArrowLink href={action.href} external={action.external}>
          {action.label}
        </ArrowLink>
      )}
    </div>
  );
};
