import type { Metadata } from "next";
import { BlogListPage } from "@/features/medium/components/BlogListPage";
import { getMediumStories, getMediumSyncStatus } from "@/features/medium/queries/mediumQueries";

// Refreshed hourly and right after a sync or an admin change (revalidatePath).
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Writing - Sumit Sonawane",
  description: "Stories by Sumit Sonawane on software development, published on Medium.",
};

export default async function Blog() {
  const [stories, { profileUrl }] = await Promise.all([getMediumStories(), getMediumSyncStatus()]);
  return <BlogListPage stories={stories} profileUrl={profileUrl} />;
}
