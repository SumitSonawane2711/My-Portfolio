// Conventional Commits — e.g. "feat: add blog tags", "fix(contact): validate email".
// Enforced on every commit by .husky/commit-msg.
const config = {
  extends: ["@commitlint/config-conventional"],
};
export default config;
