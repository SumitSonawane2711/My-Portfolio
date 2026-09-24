import Link from "next/link";
import { Container } from "@/shared/components/Container";
import { Heading } from "@/shared/components/Heading";
import { SubHeading } from "@/shared/components/SubHeading";
import { formatDate, truncate } from "@/shared/libs/format";
import { getSortedBlogs } from "../services/blogServices";

export const BlogListPage = async () => {
  const allblogs = await getSortedBlogs();

  return (
    <main className="flex min-h-screen items-start justify-start">
      <Container className="min-h-screen p-4 pt-20 md:pb-10">
        <Heading>Writing</Heading>
        <SubHeading>
          A collection of my thoughts, insights, and experiences of my journey in development.
        </SubHeading>
        <div className="mt-10 flex flex-col gap-4">
          {allblogs.map((blog) => (
            <Link
              href={`/blog/${blog.slug}`}
              key={blog.slug}
              className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-900/70"
            >
              <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                <h2 className="text-base font-semibold tracking-tight text-primary">
                  {blog.title}
                </h2>
                <p className="shrink-0 text-sm text-secondary">{formatDate(blog.date)}</p>
              </div>

              <p className="max-w-2xl pt-2 text-sm text-secondary">
                {truncate(blog.description || "", 180)}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
};
