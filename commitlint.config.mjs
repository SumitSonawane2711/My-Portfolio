// Conventional Commits — e.g. "feat(blog): add autosave", "fix(contact): escape html".
// Enforced on every commit by .husky/commit-msg.
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Warning, not error: scopes are encouraged but optional.
    "scope-enum": [
      1,
      "always",
      [
        "home",
        "about",
        "blog",
        "projects",
        "experience",
        "contact",
        "resume",
        "testimonials",
        "tech",
        "settings",
        "inbox",
        "media",
        "admin",
        "auth",
        "db",
        "ui",
        "seo",
        "ci",
        "deps",
        "release",
      ],
    ],
  },
};
export default config;
