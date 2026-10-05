import { ArrowLink } from "./ArrowLink";

type SectionHeaderProps = {
  /** Also the section's accessible name: pair with aria-labelledby={id}. */
  id: string;
  title: string;
  description?: string;
  action?: { href: string; label: string; external?: boolean };
};

export const SectionHeader = ({ id, title, description, action }: SectionHeaderProps) => {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div>
        <h2 id={id} className="text-xl font-semibold tracking-tight text-primary md:text-2xl">
          {title}
        </h2>
        {description && <p className="mt-1 max-w-xl text-sm text-secondary">{description}</p>}
      </div>
      {action && (
        <ArrowLink href={action.href} external={action.external}>
          {action.label}
        </ArrowLink>
      )}
    </div>
  );
};
