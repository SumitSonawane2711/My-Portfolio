import Link from "next/link";
import {
  Briefcase,
  Download,
  FileText,
  FolderKanban,
  Heart,
  Inbox,
  MessageSquareQuote,
  Newspaper,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { formatDate, truncate } from "@/shared/libs/format";
import type { getDashboardStats } from "../repositories/dashboardRepository";
import { PageHeader } from "./PageHeader";
import { StatCard } from "./StatCard";

type DashboardOverviewProps = {
  stats: Awaited<ReturnType<typeof getDashboardStats>>;
};

export const DashboardOverview = ({ stats }: DashboardOverviewProps) => {
  return (
    <>
      <PageHeader title="Overview" description="Everything on your portfolio at a glance." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Projects"
          value={stats.projects}
          href="/admin/projects"
          icon={FolderKanban}
        />
        <StatCard
          label="Published posts"
          value={stats.publishedPosts}
          hint={`${stats.draftPosts} draft${stats.draftPosts === 1 ? "" : "s"}`}
          href="/admin/blog"
          icon={Newspaper}
        />
        <StatCard
          label="Experience"
          value={stats.experiences}
          href="/admin/experience"
          icon={Briefcase}
        />
        <StatCard
          label="Unread messages"
          value={stats.unreadMessages}
          href="/admin/inbox"
          icon={Inbox}
        />
        <StatCard
          label="Active resumes"
          value={stats.activeResumes}
          hint={stats.primaryResume ? `Primary: ${stats.primaryResume.title}` : "No primary resume"}
          href="/admin/resumes"
          icon={FileText}
        />
        <StatCard
          label="Resume downloads"
          value={stats.resumeDownloads}
          href="/admin/resumes"
          icon={Download}
        />
        <StatCard
          label="Visible testimonials"
          value={stats.visibleTestimonials}
          href="/admin/testimonials"
          icon={MessageSquareQuote}
        />
        <StatCard label="Post likes" value={stats.likes} href="/admin/blog" icon={Heart} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Latest unread messages</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.latestUnread.length === 0 ? (
            <p className="text-sm text-muted-foreground">You&apos;re all caught up.</p>
          ) : (
            <ul className="divide-y">
              {stats.latestUnread.map((message) => (
                <li key={message.id} className="py-3 first:pt-0 last:pb-0">
                  <Link href="/admin/inbox" className="block hover:opacity-80">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <Badge variant="secondary">{message.kind.toLowerCase()}</Badge>
                      <span className="font-medium">{message.name || "Anonymous"}</span>
                      {message.post && (
                        <span className="text-muted-foreground">on “{message.post.title}”</span>
                      )}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {truncate(message.message, 140)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
};
