// Imports the site's existing static content (constants, MDX, /public files)
// into the database, one feature at a time. Idempotent: upserts by slug.
//
//   npm run content:import -- --only=projects --dry-run
//   npm run content:import -- --only=technologies,projects
//   npm run content:import                    (everything, in dependency order)
//   npm run content:import -- --overwrite      (also replace rows that already exist)
//
// Existing rows are skipped by default so dashboard edits are never lost.
import "dotenv/config";
import { db, summary, type ImportContext } from "./importers/shared";

type Importer = (ctx: ImportContext) => Promise<void>;

// Order matters: later importers connect to rows created by earlier ones.
const importers: Record<string, () => Promise<Importer>> = {
  settings: async () => (await import("./importers/settings")).importSettings,
  technologies: async () => (await import("./importers/technologies")).importTechnologies,
  projects: async () => (await import("./importers/projects")).importProjects,
  experience: async () => (await import("./importers/experience")).importExperience,
  resumes: async () => (await import("./importers/resumes")).importResumes,
  blog: async () => (await import("./importers/blog")).importBlog,
  // Last: moves everything imported from /public to Cloudinary (needs valid keys).
  "upload-local-media": async () => (await import("./importers/localMedia")).uploadLocalMedia,
};

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const overwrite = args.includes("--overwrite");
  const onlyArg = args.find((a) => a.startsWith("--only="));
  // upload-local-media talks to Cloudinary, so it only runs when named explicitly.
  const only = onlyArg
    ? onlyArg.slice("--only=".length).split(",")
    : Object.keys(importers).filter((name) => name !== "upload-local-media");

  const unknown = only.filter((name) => !(name in importers));
  if (unknown.length) {
    throw new Error(
      `Unknown importer(s): ${unknown.join(", ")}. Available: ${Object.keys(importers).join(", ")}`,
    );
  }

  console.log(dryRun ? "Dry run — nothing will be written.\n" : "Importing…\n");

  for (const name of Object.keys(importers)) {
    if (!only.includes(name)) continue;
    console.log(`▶ ${name}`);
    const run = await importers[name]();
    await run({ dryRun, overwrite });
  }

  console.log(
    `\nDone: ${summary.created} created, ${summary.updated} updated, ` +
      `${summary.skipped} skipped, ${summary.errors} errors.`,
  );
  if (summary.errors) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
