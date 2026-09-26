import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getServerEnv } from "@/shared/configs/env";
import { auth } from "./auth";

// The real protection for /admin. proxy.ts only checks that a session cookie
// exists (which anyone can fake); this validates the session server-side and
// re-checks the email on every admin page, action and route handler.

/** The session, only if it belongs to the admin email. */
export async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  if (session.user.email.toLowerCase() !== getServerEnv().ADMIN_EMAIL) return null;
  return session;
}

/** First line of every admin page and admin server action. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/login");
  return session;
}
