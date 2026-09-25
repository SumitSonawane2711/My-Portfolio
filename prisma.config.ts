import "dotenv/config";
import { defineConfig } from "prisma/config";

// The Prisma CLI (migrate, studio) uses the DIRECT (unpooled) Neon URL.
// The app itself connects through the pooled URL in src/shared/libs/db.ts.
//
// Read with process.env (not prisma's env(), which throws when unset) so
// `prisma generate` — run on every `npm install` — works without a database;
// commands that need one (migrate, studio) still fail clearly.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL_UNPOOLED ?? "",
  },
});
