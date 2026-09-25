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

export const countUnreadMessages = () => db.message.count({ where: { status: "UNREAD" } });
