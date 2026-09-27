import "server-only";
import { db } from "@/shared/libs/db";

export async function getDashboardStats() {
  const [
    projects,
    publishedPosts,
    draftPosts,
    experiences,
    activeResumes,
    resumeDownloads,
    visibleTestimonials,
    unreadMessages,
    likes,
    latestUnread,
    primaryResume,
  ] = await Promise.all([
    db.project.count(),
    db.post.count({ where: { status: { in: ["PUBLISHED", "SCHEDULED"] } } }),
    db.post.count({ where: { status: "DRAFT" } }),
    db.experience.count(),
    db.resume.count({ where: { status: "ACTIVE" } }),
    db.resume.aggregate({ _sum: { downloadCount: true } }),
    db.testimonial.count({ where: { visible: true } }),
    db.message.count({ where: { status: "UNREAD" } }),
    db.postLike.count(),
    db.message.findMany({
      where: { status: "UNREAD" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        kind: true,
        name: true,
        message: true,
        createdAt: true,
        post: { select: { title: true } },
      },
    }),
    db.resume.findFirst({
      where: { isPrimary: true },
      select: { title: true, downloadCount: true },
    }),
  ]);

  return {
    projects,
    publishedPosts,
    draftPosts,
    experiences,
    activeResumes,
    resumeDownloads: resumeDownloads._sum.downloadCount ?? 0,
    visibleTestimonials,
    unreadMessages,
    likes,
    latestUnread,
    primaryResume,
  };
}

// Raw rows for the overview charts; bucketing happens in dashboardCharts.ts.
export async function getChartRows(since: Date) {
  const [messages, likes, resumes, likedPosts] = await Promise.all([
    db.message.findMany({
      where: { createdAt: { gte: since } },
      select: { kind: true, createdAt: true },
    }),
    db.postLike.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    db.resume.findMany({
      orderBy: [{ downloadCount: "desc" }, { order: "asc" }],
      take: 6,
      select: { title: true, downloadCount: true, status: true },
    }),
    db.post.findMany({
      where: { likes: { some: {} } },
      orderBy: { likes: { _count: "desc" } },
      take: 5,
      select: { title: true, _count: { select: { likes: true } } },
    }),
  ]);
  return { messages, likes, resumes, likedPosts };
}

export const countUnreadMessages = () => db.message.count({ where: { status: "UNREAD" } });
