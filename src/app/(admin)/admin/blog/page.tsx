import type { Metadata } from "next";
import { requireAdmin } from "@/shared/libs/authGuard";
import { MediumPostsManager } from "@/features/medium/components/MediumPostsManager";
import {
  getMediumPostsForAdmin,
  getMediumSyncStatusForAdmin,
} from "@/features/medium/queries/mediumQueries";

export const metadata: Metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  await requireAdmin();
  const [posts, status] = await Promise.all([
    getMediumPostsForAdmin(),
    getMediumSyncStatusForAdmin(),
  ]);
  const syncedLabel = status.syncedAt
    ? `${status.syncedAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })} UTC`
    : null;
  return <MediumPostsManager posts={posts} feedUrl={status.feedUrl} syncedLabel={syncedLabel} />;
}
