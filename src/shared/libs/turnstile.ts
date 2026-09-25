import "server-only";
import { getServerEnv } from "@/shared/configs/env";

// Verifies a Cloudflare Turnstile token server-side.
export async function verifyTurnstile(token: string, ip?: string) {
  if (!token) return false;

  const body = new FormData();
  body.append("secret", getServerEnv().TURNSTILE_SECRET_KEY);
  body.append("response", token);
  if (ip && ip !== "unknown") body.append("remoteip", ip);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      cache: "no-store",
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification failed:", error);
    return false;
  }
}
