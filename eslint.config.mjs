import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // Use the `@/` alias for anything outside the current folder's parent
      // (e.g. "@/shared/components/Container", not "../../shared/...").
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../../*"],
              message: "Use the '@/' absolute import alias instead of deep relative paths.",
            },
          ],
        },
      ],
    },
  },
  {
    // Scripts run outside Next.js and log their progress.
    files: ["scripts/**", "prisma/**"],
    rules: { "no-console": "off" },
  },
  // Last, so it switches off any stylistic rules that would fight Prettier.
  prettierConfig,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    "src/generated/**",
    "prisma/migrations/**",
  ]),
]);

export default eslintConfig;
