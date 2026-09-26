// "Hello, World! — Ça va?" → "hello-world-ca-va"
export const slugify = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Tries `base`, `base-2`, `base-3`, … until `exists` returns false.
export async function uniqueSlug(base: string, exists: (slug: string) => Promise<boolean>) {
  const root = slugify(base) || "item";
  let candidate = root;
  for (let n = 2; await exists(candidate); n++) {
    candidate = `${root}-${n}`;
  }
  return candidate;
}
