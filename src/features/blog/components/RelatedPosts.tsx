import Link from "next/link";
import { formatDate } from "@/shared/libs/format";
import type { BlogCard } from "../interfaces/blog";

export const RelatedPosts = ({ posts }: { posts: BlogCard[] }) => {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-neutral-200 pt-8 dark:border-neutral-800">
      <h2 className="mb-4 text-sm font-semibold text-primary">Related posts</h2>
      <ul className="flex flex-col gap-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="flex flex-col gap-1 text-sm md:flex-row md:justify-between"
            >
              <span className="font-medium text-primary hover:underline">{post.title}</span>
              <span className="shrink-0 text-secondary">{formatDate(post.publishedAt)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
