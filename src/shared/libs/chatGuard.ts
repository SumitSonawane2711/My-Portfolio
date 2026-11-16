import type { NextRequest } from "next/server";

const BLOCKED_PATTERNS = [
  /ignore (all|any|the)? ?(previous|above|prior) (instructions|rules)/i,
  /(reveal|show|print|repeat).{0,30}(system prompt|instructions)/i,
  /you are now/i,
  /jailbreak/i,
  /\bDAN\b/,
];

export function isSuspicious(text: string) {
  if (BLOCKED_PATTERNS.some((pattern) => pattern.test(text))) return true;
  if ((text.match(/https?:\/\//gi) ?? []).length > 2) return true;
  if (/(.)\1{15,}/.test(text)) return true; // same character repeated
  return false;
}

export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
