import { z } from "zod";

// One return shape for every server action, so every client form handles
// results the same way (see local-docs guide, Part 4.2).
export type FieldErrors = Record<string, string[] | undefined>;

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

export function ok(): ActionResult<undefined>;
export function ok<T>(data: T): ActionResult<T>;
export function ok<T>(data?: T): ActionResult<T | undefined> {
  return { ok: true, data };
}

export const fail = (error: string, fieldErrors?: FieldErrors): ActionResult<never> => ({
  ok: false,
  error,
  fieldErrors,
});

export const validationFail = (error: z.ZodError): ActionResult<never> =>
  fail("Please fix the highlighted fields.", z.flattenError(error).fieldErrors as FieldErrors);
