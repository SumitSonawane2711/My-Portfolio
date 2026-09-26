import "server-only";
import { z } from "zod";

// Server-only environment variables from the single `.env` file (see
// `.env.example`). Never import this from a Client Component — `server-only`
// turns that into a build error. Scripts and CLIs (prisma, better-auth,
// scripts/*) can't import it either; they read process.env directly.
const serverSchema = z.object({
  DATABASE_URL: z.url(),
  DATABASE_URL_UNPOOLED: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32, "Run: openssl rand -base64 32"),
  BETTER_AUTH_URL: z.url(),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  ADMIN_EMAIL: z.email().transform((v) => v.toLowerCase()),
  NEXT_PUBLIC_SITE_URL: z.url(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_FOLDER: z.string().default("portfolio"),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  HASH_SALT: z.string().min(16, "Run: openssl rand -hex 32"),
  GMAIL_USER: z.email(),
  GMAIL_APP_PASSWORD: z.string().min(1),
  CONTACT_RECEIVER_EMAIL: z.union([z.email(), z.literal("")]).optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | undefined;

// Validated on first use rather than at import, so `next build` works where
// secrets aren't set (CI). src/instrumentation.ts calls this when the server
// starts, so a bad `.env` still fails fast with a readable list.
export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  if (process.env.SKIP_ENV_VALIDATION === "true") {
    cached = process.env as unknown as ServerEnv;
    return cached;
  }

  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`);
    throw new Error(`Invalid environment variables:\n${issues.join("\n")}`);
  }

  cached = parsed.data;
  return cached;
}
