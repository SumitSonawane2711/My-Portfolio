import type { Metadata } from "next";
import { BlogListPage } from "@/features/blog/components/BlogListPage";
import { getPosts } from "@/features/blog/queries/blogQueries";

// Hourly revalidation also makes scheduled posts appear without a cron job.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Blogs - Sumit Sonawane",
  description: "All Blogs by sumit",
};

export default async function Blogs() {
  return <BlogListPage posts={await getPosts()} />;
}
