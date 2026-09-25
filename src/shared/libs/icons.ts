import "server-only";
import { icons as tabler } from "@iconify-json/tabler";
import { icons as logos } from "@iconify-json/logos";
import { icons as devicon } from "@iconify-json/devicon";
import { getIconData, iconToHTML, iconToSVG, replaceIDs } from "@iconify/utils";

// Icon sets are large JSON files — server-only keeps them out of every client
// bundle. Components receive pre-rendered SVG strings instead.
const SETS = { tabler, logos, devicon } as const;
type SetName = keyof typeof SETS;

export const ICON_KEY_PATTERN = /^(tabler|logos|devicon):[a-z0-9-]+$/;

type RenderOptions = {
  /** Tint for single-color sets (tabler). Full-color logos ignore it. */
  color?: string | null;
};

/** "tabler:brand-react" → an <svg> string sized to its container, or null. */
export function renderIconSvg(key: string | null | undefined, { color }: RenderOptions = {}) {
  if (!key || !ICON_KEY_PATTERN.test(key)) return null;
  const [prefix, name] = key.split(":") as [SetName, string];
  const data = getIconData(SETS[prefix], name);
  if (!data) return null;

  const { attributes, body } = iconToSVG(data, { height: "100%" });
  let svgBody = replaceIDs(body);
  // Match the site's original @tabler/icons-react rendering (stroke 1.8).
  if (prefix === "tabler") svgBody = svgBody.replace(/stroke-width="2"/g, 'stroke-width="1.8"');

  const attrs: Record<string, string> = { ...attributes, "aria-hidden": "true" };
  if (color && prefix === "tabler") attrs.style = `color:${color}`;
  return iconToHTML(svgBody, attrs);
}

/** Icon keys whose name contains the query, tabler first. */
export function searchIcons(query: string, limit = 24) {
  const q = query.trim().toLowerCase().replace(/\s+/g, "-");
  if (q.length < 2) return [];
  const results: string[] = [];
  for (const prefix of Object.keys(SETS) as SetName[]) {
    for (const name of Object.keys(SETS[prefix].icons)) {
      if (name.includes(q)) results.push(`${prefix}:${name}`);
      if (results.length >= limit) return results;
    }
  }
  return results;
}
