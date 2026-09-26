import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/shared/libs/authGuard";
import { PostArticle } from "@/features/blog/components/PostArticle";
import { getPostForPreview } from "@/features/blog/queries/blogQueries";

export const metadata: Metadata = { title: "Preview" };

interface PageProps {
  params: Promise<{ id: string }>;
}

// Renders a post (any status) exactly like the public page, for review.
export default async function PostPreviewPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const post = await getPostForPreview(id);
  if (!post) notFound();

  return (
    <PostArticle
      post={{ ...post, publishedAt: post.publishedAt.getTime() ? post.publishedAt : new Date() }}
      banner={
        <p className="mb-6 rounded-md bg-yellow-100 px-3 py-2 text-sm font-medium text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-100">
          Preview · {post.status === "DRAFT" ? "not published" : post.status.toLowerCase()}
        </p>
      }
    />
  );
}
