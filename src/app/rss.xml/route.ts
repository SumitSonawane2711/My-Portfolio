import { Feed } from "feed";
import { clientEnv } from "@/shared/configs/clientEnv";
import { blogRepository } from "@/features/blog/repositories/blogRepository";
import { getSettings } from "@/features/settings/queries/settingsQueries";

export const revalidate = 3600;

export async function GET() {
  const base = clientEnv.siteUrl;
  const [settings, posts] = await Promise.all([
    getSettings(),
    blogRepository.listVisibleForFeed(20),
  ]);

  const feed = new Feed({
    title: `${settings.name || settings.siteTitle} — Blog`,
    description: settings.siteDescription,
    id: `${base}/blog`,
    link: `${base}/blog`,
    language: "en",
    copyright: `© ${new Date().getFullYear()} ${settings.name}`,
    feedLinks: { rss: `${base}/rss.xml` },
    author: { name: settings.name, link: base },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${base}/blog/${post.slug}`,
      link: `${base}/blog/${post.slug}`,
      description: post.excerpt,
      content: post.contentHtml,
      date: post.publishedAt ?? post.updatedAt,
      category: post.tags.map((t) => ({ name: t.name })),
    });
  }

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
