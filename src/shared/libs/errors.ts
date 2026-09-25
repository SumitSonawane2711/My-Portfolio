export type AppErrorCode = "NOT_FOUND" | "CONFLICT" | "BAD_REQUEST" | "RATE_LIMITED";

// An error whose message is safe to show to the user. Anything else is logged
// and replaced with a generic message.
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: AppErrorCode = "BAD_REQUEST",
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const toErrorMessage = (error: unknown) => {
  if (error instanceof AppError) return error.message;
  console.error(error);
  return "Something went wrong. Please try again.";
};
