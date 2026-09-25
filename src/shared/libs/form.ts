import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { FieldErrors } from "./actionResult";

// Copies server-side validation errors from an ActionResult into the matching
// React Hook Form fields.
export function applyFieldErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  fieldErrors: FieldErrors | undefined,
) {
  if (!fieldErrors) return;
  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (messages?.length) setError(field as Path<T>, { type: "server", message: messages[0] });
  }
}
