import type { Prisma } from "@/generated/prisma/client";
import { db, log, registerLocalFile, type ImportContext } from "./shared";

// Values from the old shared/constants/site.ts, Hero.tsx and the root layout
// metadata. "2+ years" becomes "{years}+ years" so it stays current
// (worked out from the Experience start dates).
const SETTINGS = {
  name: "Sumit Sonawane",
  siteTitle: "Full Stack Developer Portfolio",
  siteDescription: "Personal portfolio showcasing full stack development work",
  heroHeading: "Hello, I am Sumit",
  heroSubheading:
    "Motivated and detail-oriented MERN Stack Developer with {years}+ years of professional experience in developing and maintaining dynamic web applications. Proficient in React.js, Node.js, Express.js. Demonstrated ability to work collaboratively in a team environment and effectively manage individual project tasks.",
  summary: "Motivated and detail-oriented MERN Stack Developer.",
  phone: "+919423749105",
  socials: [
    { platform: "github", url: "https://github.com/SumitSonawane2711" },
    { platform: "linkedin", url: "https://in.linkedin.com/in/sumit-sonawane-2b504b219" },
  ],
};

export async function importSettings(ctx: ImportContext) {
  try {
    const avatarId = await registerLocalFile(ctx, "/profile.png", "Sumit Sonawane");
    const existing = await db.siteSettings.findUnique({ where: { id: 1 } });
    const data = {
      ...SETTINGS,
      socials: SETTINGS.socials as Prisma.InputJsonValue,
      ...(ctx.dryRun ? {} : { avatarId }),
    };
    if (!ctx.dryRun) {
      await db.siteSettings.upsert({ where: { id: 1 }, create: { id: 1, ...data }, update: data });
    }
    if (existing) log.updated("site settings");
    else log.created("site settings");
  } catch (error) {
    log.error("site settings", error);
  }
}
