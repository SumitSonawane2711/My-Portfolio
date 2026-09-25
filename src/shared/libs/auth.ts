import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";

// Relative import + process.env on purpose: the Better Auth CLI loads this
// file outside Next.js (no "@/" alias, and configs/env.ts is server-only).
const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),

  // No email/password sign-up: GitHub is the only way in.
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh the expiry once a day
    // Signed cookie cache: skips a database lookup on most admin requests.
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },

  databaseHooks: {
    user: {
      create: {
        // Runs before any user row is created — only the admin email passes.
        before: async (user) => {
          if (!adminEmail || user.email.toLowerCase() !== adminEmail) {
            throw new APIError("FORBIDDEN", { message: "This dashboard is private." });
          }
          return { data: user };
        },
      },
    },
  },

  plugins: [nextCookies()], // must be the last plugin
});

export type Session = typeof auth.$Infer.Session;
