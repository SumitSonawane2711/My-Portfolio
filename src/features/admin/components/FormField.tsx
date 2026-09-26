import type { ReactNode } from "react";
import { Label } from "@/shared/components/ui/label";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

// Label + control + hint/error, used by every admin form.
export const FormField = ({ label, htmlFor, error, hint, children }: FormFieldProps) => (
  <div className="flex flex-col gap-2">
    <Label htmlFor={htmlFor}>{label}</Label>
    {children}
    {error ? (
      <p className="text-sm text-destructive">{error}</p>
    ) : (
      hint && <p className="text-xs text-muted-foreground">{hint}</p>
    )}
  </div>
);
