import Link from "next/link";
import { formatDate, truncate } from "@/shared/libs/format";
import type { BlogCard } from "../interfaces/blog";

// Shown below an article: posts sharing a tag first, then the latest others.
// Same card style as the blog list and the home page.
export const RelatedPosts = ({ posts }: { posts: BlogCard[] }) => {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-neutral-200 pt-8 dark:border-neutral-800">
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-primary">Related posts</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex flex-col rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-900/70"
          >
            <h3 className="text-sm font-semibold tracking-tight text-primary">{post.title}</h3>
            <p className="pt-1 text-xs text-secondary">
              {formatDate(post.publishedAt)} · {post.readingMinutes} min read
            </p>
            <p className="pt-2 text-sm text-secondary">{truncate(post.excerpt, 110)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};
