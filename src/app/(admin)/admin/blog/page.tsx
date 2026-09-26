import type { Metadata } from "next";
import { requireAdmin } from "@/shared/libs/authGuard";
import { PostsManager } from "@/features/blog/components/PostsManager";
import { getPostsForAdmin } from "@/features/blog/queries/blogQueries";

export const metadata: Metadata = { title: "Blog" };

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminBlogPage({ searchParams }: PageProps) {
  await requireAdmin();
  const { status } = await searchParams;
  return <PostsManager posts={await getPostsForAdmin(status)} />;
}
