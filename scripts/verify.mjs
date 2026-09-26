// Runs the same checks as .github/workflows/ci.yml, locally, so a push to
// `dev` doesn't fail in CI. Used by .husky/pre-push; run it any time with
//
//   npm run verify              (everything, including the production build)
//   npm run verify -- --no-build
//
// Stops at the first failing step. Differences from CI: the build uses your
// local .env (CI uses a separate Neon branch), and there's an extra check that
// every schema change has a migration.
import { spawnSync } from "node:child_process";

const skipBuild = process.argv.includes("--no-build");

/** @type {{ name: string; cmd: string; hint: string; optional?: boolean; drift?: boolean }[]} */
const steps = [
  {
    name: "Lint",
    // Cached: only changed files are re-linted (~5 s instead of ~30 s).
    cmd: "npx eslint . --cache --cache-location node_modules/.cache/eslint/",
    hint: "Fix the errors above (npm run lint:fix fixes many automatically).",
  },
  { name: "Format check", cmd: "npx prettier --check .", hint: "Run: npm run format" },
  {
    name: "Prisma schema",
    cmd: "npx prisma validate",
    hint: "Fix prisma/schema.prisma (npm run db:format).",
  },
  {
    name: "Schema has migrations",
    cmd: "npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code",
    hint: "schema.prisma has changes with no migration. Run: npm run db:migrate -- --name <what-changed>",
    drift: true,
  },
  { name: "Typecheck", cmd: "npm run typecheck", hint: "Fix the type errors above." },
  { name: "Unit tests", cmd: "npx vitest run", hint: "Fix the failing tests above." },
  ...(skipBuild
    ? []
    : [{ name: "Production build", cmd: "npx next build", hint: "Fix the build error above." }]),
];

const run = (cmd) => spawnSync(cmd, { shell: true, stdio: "inherit" }).status ?? 1;
const seconds = (start) => `${((Date.now() - start) / 1000).toFixed(1)}s`;
const total = Date.now();

for (const [index, step] of steps.entries()) {
  const label = `[${index + 1}/${steps.length}] ${step.name}`;
  console.log(`\n▶ ${label}`);
  const start = Date.now();
  let status = run(step.cmd);

  if (step.drift) {
    // 0 = in sync, 2 = schema changed without a migration, 1 = couldn't check
    // (usually the Neon branch waking up) → retry once, then warn and go on.
    if (status === 1) status = run(step.cmd);
    if (status === 1) {
      console.log(
        `⚠ ${label}: skipped — couldn't reach the database (CI doesn't need this check).`,
      );
      continue;
    }
  }

  if (status !== 0) {
    console.error(`\n✖ ${label} failed after ${seconds(start)}.\n  ${step.hint}\n`);
    console.error("  Nothing was pushed. Fix it, commit, and push again.");
    process.exit(1);
  }
  console.log(`✔ ${label} (${seconds(start)})`);
}

console.log(`\n✔ All checks passed in ${seconds(total)} — CI should pass too.\n`);
