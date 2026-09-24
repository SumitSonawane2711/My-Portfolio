/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
  // Sorts Tailwind classes into the canonical order — order only, never changes styles.
  plugins: ["prettier-plugin-tailwindcss"],
  // Tailwind v4 has no JS config — point the plugin at the CSS entry so it
  // knows the custom theme tokens (text-primary, text-secondary, ...).
  tailwindStylesheet: "./src/app/globals.css",
};

export default config;
