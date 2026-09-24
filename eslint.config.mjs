import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettierConfig from "eslint-config-prettier/flat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// eslint-config-next 15 only ships legacy (eslintrc) configs, so FlatCompat
// bridges them into flat config. Run via the ESLint CLI (`npm run lint`) —
// `next lint` is deprecated and removed in Next.js 16.
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
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
  // Last, so it switches off any stylistic rules that would fight Prettier.
  prettierConfig,
];

export default eslintConfig;
