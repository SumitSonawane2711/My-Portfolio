// Runs once when a Next.js server instance starts. A missing or malformed key
// fails the boot with a readable list instead of an error deep inside a request.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getServerEnv } = await import("@/shared/configs/env");
    getServerEnv();
  }
}
