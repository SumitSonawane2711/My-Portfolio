import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/shared/libs/authGuard";
import { ConfirmDeleteButton } from "@/features/admin/components/ConfirmDeleteButton";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { deletePost } from "@/features/blog/actions/blogActions";
import { PostEditor } from "@/features/blog/components/PostEditor";
import { getAllTagNames, getPostForEdit } from "@/features/blog/queries/blogQueries";

export const metadata: Metadata = { title: "Edit post" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const [post, tags] = await Promise.all([getPostForEdit(id), getAllTagNames()]);
  if (!post) notFound();

  return (
    <>
      <PageHeader
        title={post.title || "New post"}
        description={post.slug ? `/blog/${post.slug}` : "Not published yet"}
        actions={
          <ConfirmDeleteButton
            itemName={post.title || "this draft"}
            onConfirm={deletePost.bind(null, post.id)}
            redirectTo="/admin/blog"
          />
        }
      />
      {/* key: remount the editor when switching between posts */}
      <PostEditor key={post.id} post={post} tagSuggestions={tags} />
    </>
  );
}
