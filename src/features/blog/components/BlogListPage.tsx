import Link from "next/link";
import { Container } from "@/shared/components/Container";
import { Heading } from "@/shared/components/Heading";
import { SubHeading } from "@/shared/components/SubHeading";
import { formatDate, truncate } from "@/shared/libs/format";
import type { BlogCard, TagRef } from "../interfaces/blog";

type BlogListPageProps = {
  posts: BlogCard[];
  /** Set on /blog/tag/[tag]. */
  tag?: TagRef;
};

export const BlogListPage = ({ posts, tag }: BlogListPageProps) => {
  return (
    <main className="flex min-h-screen items-start justify-start">
      <Container className="min-h-screen p-4 pt-20 md:pb-10">
        <Heading>{tag ? `#${tag.name}` : "Writing"}</Heading>
        <SubHeading>
          {tag ? (
            <>
              Posts tagged {tag.name}.{" "}
              <Link href="/blog" className="font-medium text-primary">
                All posts
              </Link>
            </>
          ) : (
            "A collection of my thoughts, insights, and experiences of my journey in development."
          )}
        </SubHeading>
        <div className="mt-10 flex flex-col gap-4">
          {posts.map((blog) => (
            <Link
              href={`/blog/${blog.slug}`}
              key={blog.slug}
              className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-900/70"
            >
              <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                <h2 className="text-base font-semibold tracking-tight text-primary">
                  {blog.title}
                </h2>
                <p className="shrink-0 text-sm text-secondary">{formatDate(blog.publishedAt)}</p>
              </div>

              <p className="max-w-2xl pt-2 text-sm text-secondary">{truncate(blog.excerpt, 180)}</p>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
};
