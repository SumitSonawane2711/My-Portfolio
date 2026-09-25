// Shared helpers for the content importers. Runs under tsx, outside Next.js:
// import only `db` and `shared/libs/content/*` from the app — never
// repositories/services/actions or configs/env.ts (they are `server-only`).
import { db } from "@/shared/libs/db";

export { db };

export type ImportContext = {
  dryRun: boolean;
};

type Summary = { created: number; updated: number; skipped: number; errors: number };

export const summary: Summary = { created: 0, updated: 0, skipped: 0, errors: 0 };

export const log = {
  created: (what: string) => {
    summary.created++;
    console.log(`  ✔ created  ${what}`);
  },
  updated: (what: string) => {
    summary.updated++;
    console.log(`  ↻ updated  ${what}`);
  },
  skipped: (what: string, why: string) => {
    summary.skipped++;
    console.log(`  – skipped  ${what} (${why})`);
  },
  error: (what: string, error: unknown) => {
    summary.errors++;
    console.log(`  ✖ error    ${what}: ${error instanceof Error ? error.message : String(error)}`);
  },
  info: (message: string) => console.log(`  · ${message}`),
};

// Upserts by a unique key and reports created/updated. In dry-run mode it
// only reports what would happen.
export async function reportUpsert(
  ctx: ImportContext,
  label: string,
  exists: () => Promise<boolean>,
  write: () => Promise<unknown>,
) {
  try {
    const existed = await exists();
    if (!ctx.dryRun) await write();
    if (existed) log.updated(label);
    else log.created(label);
  } catch (error) {
    log.error(label, error);
  }
}
