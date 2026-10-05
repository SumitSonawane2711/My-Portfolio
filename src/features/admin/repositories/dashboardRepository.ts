import "server-only";
import { db } from "@/shared/libs/db";

export async function getDashboardStats() {
  const [
    projects,
    mediumStories,
    hiddenStories,
    technologies,
    experiences,
    activeResumes,
    resumeDownloads,
    visibleTestimonials,
    unreadMessages,
    latestUnread,
    primaryResume,
  ] = await Promise.all([
    db.project.count(),
    db.mediumPost.count({ where: { hidden: false } }),
    db.mediumPost.count({ where: { hidden: true } }),
    db.technology.count(),
    db.experience.count(),
    db.resume.count({ where: { status: "ACTIVE" } }),
    db.resume.aggregate({ _sum: { downloadCount: true } }),
    db.testimonial.count({ where: { visible: true } }),
    db.message.count({ where: { status: "UNREAD" } }),
    db.message.findMany({
      where: { status: "UNREAD" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        message: true,
        createdAt: true,
      },
    }),
    db.resume.findFirst({
      where: { isPrimary: true },
      select: { title: true, downloadCount: true },
    }),
  ]);

  return {
    projects,
    mediumStories,
    hiddenStories,
    technologies,
    experiences,
    activeResumes,
    resumeDownloads: resumeDownloads._sum.downloadCount ?? 0,
    visibleTestimonials,
    unreadMessages,
    latestUnread,
    primaryResume,
  };
}

// Raw rows for the overview charts; bucketing happens in dashboardCharts.ts.
export async function getChartRows(since: Date) {
  const [messages, stories, resumes] = await Promise.all([
    db.message.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    db.mediumPost.findMany({
      where: { hidden: false, publishedAt: { gte: since } },
      select: { publishedAt: true },
    }),
    db.resume.findMany({
      orderBy: [{ downloadCount: "desc" }, { order: "asc" }],
      take: 6,
      select: { title: true, downloadCount: true, status: true },
    }),
  ]);
  return { messages, stories, resumes };
}

export const countUnreadMessages = () => db.message.count({ where: { status: "UNREAD" } });
