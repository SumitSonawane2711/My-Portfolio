import { db, log, skipExisting, type ImportContext } from "./shared";

// Snapshot of the old features/experience/constants/professional-experience.ts.
// The commented-out Paarsh Infotech entry is imported unpublished (hidden, as before).
const EXPERIENCE = [
  {
    company: "Rwaltz Software",
    role: "Software Developer",
    slug: "rwaltz-software",
    url: "https://www.rwaltz.com/",
    technologies: [
      "React",
      "Node.js",
      "Express.js",
      "Adonis.js",
      "MySQL",
      "MongoDB",
      "PostgreSQL",
      "TypeScript",
      "Tailwind CSS",
    ],
    from: "Aug 2025",
    to: "Present",
    published: true,
    summary:
      "As a Software Developer at Rwaltz Software, Built and integrated secure RESTful APIs, authentication, and Role-Based Access Control (RBAC) using Node.js, Express.js, and Adonis.js. Collaborated with cross-functional teams in Agile sprints to deliver end-to-end features, optimize application performance, and ensure code quality through reviews and best practices.",
  },
  {
    company: "Sinss Digital",
    role: "Web Developer",
    slug: "sinss-digital",
    url: "https://sinss.in/",
    technologies: [
      "React",
      "Next.js",
      "Express.js",
      "TypeScript",
      "Shopify",
      "Tailwind CSS",
      "JavaScript",
      "HTML",
      "CSS",
    ],
    from: "July 2024",
    to: "July 2025",
    published: true,
    summary:
      "Developing and delivering Full Stack web applications using Next.js, React.js, TypeScript, and other modern web technologies. My role involves collaborating directly with clients to understand business requirements, translating them into intuitive and high-performing digital solutions, and ensuring seamless execution from development to deployment. I focus on creating scalable, user-centric applications with strong emphasis on UI/UX, performance, SEO, and maintainability.",
  },
  {
    company: "Paarsh Infotech",
    role: "MERN Stack Developer",
    slug: "paarsh-infotech",
    url: "https://www.paarshinfotech.com/",
    technologies: ["Next.js", "React", "Node.js", "Express.js", "TypeScript", "Tailwind CSS"],
    from: "July 2024",
    to: "Feb 2025",
    published: false,
    summary:
      "As a MERN Stack Developer at Paarsh Infotech, I specialize in building and maintaining full-stack web applications using MongoDB, Express.js, React.js, and Node.js. My role involves designing robust backend services, creating dynamic front-end interfaces, and ensuring seamless integration between the two. I work closely with cross-functional teams to deliver high-performance, scalable solutions tailored to client needs.",
  },
];

/** "Aug 2025" / "July 2024" → first of that month (UTC); "Present" → null. */
function parseMonth(value: string) {
  if (/^present$/i.test(value.trim())) return null;
  const date = new Date(`1 ${value} UTC`);
  if (Number.isNaN(date.getTime())) throw new Error(`Can't parse date "${value}"`);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export async function importExperience(ctx: ImportContext) {
  for (const item of EXPERIENCE) {
    const label = `experience ${item.slug}`;
    try {
      const startDate = parseMonth(item.from);
      if (!startDate) throw new Error("start date can't be Present");
      const endDate = parseMonth(item.to);
      const techs = await db.technology.findMany({
        where: { name: { in: item.technologies, mode: "insensitive" } },
        select: { id: true },
      });
      if (techs.length < item.technologies.length)
        log.info(`${item.slug}: some technologies not found`);

      const existing = await db.experience.findUnique({ where: { slug: item.slug } });
      if (skipExisting(ctx, Boolean(existing), label)) continue;
      const data = {
        company: item.company,
        role: item.role,
        companyUrl: item.url,
        startDate,
        endDate,
        summary: item.summary,
        published: item.published,
      };
      if (!ctx.dryRun) {
        await db.experience.upsert({
          where: { slug: item.slug },
          create: { ...data, slug: item.slug, technologies: { connect: techs } },
          update: { ...data, technologies: { set: techs } },
        });
      }
      if (existing) log.updated(label);
      else log.created(label);
    } catch (error) {
      log.error(label, error);
    }
  }
  log.info(
    "src/data/professional-experience/*.mdx are placeholders (acme-studio, northstar-labs) — not imported",
  );
}
