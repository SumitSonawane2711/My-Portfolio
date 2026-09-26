// Runs on staged files only, from .husky/pre-commit (fast: seconds).
// The full CI pipeline (typecheck, tests, build…) runs in .husky/pre-push.
const config = {
  "*.{ts,tsx,js,jsx,mjs,cjs}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,yaml,css}": ["prettier --write"],
  // A function ignores the file list: these commands check the whole schema.
  "prisma/schema.prisma": () => ["prisma validate", "prisma format --check"],
};
export default config;
