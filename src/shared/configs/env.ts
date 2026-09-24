// Server-only environment variables. Next.js loads the single `.env` file at
// the project root natively — see `.env.example` for the full list.
//
// Read lazily (not at module load) so `next build` doesn't fail when these
// aren't set in the build environment; they're only needed when the contact
// route actually runs. Never import this file from a Client Component.
export function getServerEnv() {
  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables.");
  }

  return {
    GMAIL_USER,
    GMAIL_APP_PASSWORD,
    CONTACT_RECEIVER_EMAIL: process.env.CONTACT_RECEIVER_EMAIL || GMAIL_USER,
  };
}
