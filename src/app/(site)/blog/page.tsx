import type { Metadata } from "next";
import { BlogListPage } from "@/features/blog/components/BlogListPage";

export const metadata: Metadata = {
  title: "All Blogs - Sumit Sonawane",
  description: "All Blogs by sumit",
};

export default function Blogs() {
  return <BlogListPage />;
}
