import { icons as tabler } from "@iconify-json/tabler";
import { getIconData } from "@iconify/utils";
import { slugify } from "@/shared/libs/slug";
import { db, log, reportUpsert, type ImportContext } from "./shared";

// The 15 technologies from the old shared/components/TechIcons.tsx map, with
// the same Tabler artwork and brand colors (so the project cards look identical).
const TECHNOLOGIES: { name: string; icon: string; color: string }[] = [
  { name: "React", icon: "tabler:brand-react", color: "#61DAFB" },
  { name: "Next.js", icon: "tabler:brand-nextjs", color: "#e4e7ed" },
  { name: "Node.js", icon: "tabler:brand-nodejs", color: "#339933" },
  { name: "Express.js", icon: "tabler:api", color: "#6B7280" },
  { name: "Adonis.js", icon: "tabler:api", color: "#5A45FF" },
  { name: "TypeScript", icon: "tabler:brand-typescript", color: "#3178C6" },
  { name: "JavaScript", icon: "tabler:brand-javascript", color: "#F7DF1E" },
  { name: "Tailwind CSS", icon: "tabler:brand-tailwind", color: "#06B6D4" },
  { name: "MongoDB", icon: "tabler:brand-mongodb", color: "#47A248" },
  { name: "MySQL", icon: "tabler:brand-mysql", color: "#4479A1" },
  { name: "PostgreSQL", icon: "tabler:database", color: "#4169E1" },
  { name: "HTML", icon: "tabler:brand-html5", color: "#E34F26" },
  { name: "CSS", icon: "tabler:brand-css3", color: "#1572B6" },
  { name: "Shopify", icon: "tabler:shopping-bag", color: "#7AB55C" },
  { name: "WordPress", icon: "tabler:brand-wordpress", color: "#21759B" },
];

export async function importTechnologies(ctx: ImportContext) {
  for (const [order, tech] of TECHNOLOGIES.entries()) {
    const iconName = tech.icon.split(":")[1];
    const icon = getIconData(tabler, iconName) ? tech.icon : null;
    if (!icon) log.info(`${tech.name}: icon ${tech.icon} not found, using a letter fallback`);

    const slug = slugify(tech.name);
    await reportUpsert(
      ctx,
      `technology ${tech.name}`,
      async () => Boolean(await db.technology.findUnique({ where: { slug } })),
      () =>
        db.technology.upsert({
          where: { slug },
          create: { name: tech.name, slug, icon, color: tech.color, order },
          update: { name: tech.name, icon, color: tech.color, order },
        }),
    );
  }
}
