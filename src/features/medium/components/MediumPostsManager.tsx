"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Eye, EyeOff, Pencil, Plus, RefreshCw, Star } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatDate } from "@/shared/libs/format";
import { cn } from "@/shared/libs/utils";
import { ConfirmDeleteButton } from "@/features/admin/components/ConfirmDeleteButton";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { deleteMediumPost, setMediumPostFlag, syncMediumNow } from "../actions/mediumActions";
import type { MediumPostAdminRow } from "../interfaces/medium";
import { mediumImage } from "../services/mediumFeed";
import { MediumPostDialog } from "./MediumPostDialog";

type MediumPostsManagerProps = {
  posts: MediumPostAdminRow[];
  feedUrl: string | null;
  /** Pre-formatted on the server (avoids a time-zone hydration mismatch). */
  syncedLabel: string | null;
};

export const MediumPostsManager = ({ posts, feedUrl, syncedLabel }: MediumPostsManagerProps) => {
  const router = useRouter();
  const [syncing, startSync] = useTransition();
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<{ open: boolean; post: MediumPostAdminRow | null }>({
    open: false,
    post: null,
  });

  const sync = () =>
    startSync(async () => {
      const result = await syncMediumNow();
      if (!result.ok) toast.error(result.error);
      else
        toast.success(
          result.data.added > 0
            ? `${result.data.added} new ${result.data.added === 1 ? "story" : "stories"} added`
            : `Up to date (${result.data.total} in the feed)`,
        );
      router.refresh();
    });

  const flag = (post: MediumPostAdminRow, field: "hidden" | "featured") =>
    startTransition(async () => {
      const value = !post[field];
      const result = await setMediumPostFlag(post.id, field, value);
      if (!result.ok) toast.error(result.error);
      else if (field === "hidden")
        toast.success(value ? "Hidden from the site" : "Shown on the site");
      else toast.success(value ? "Featured on the home page" : "No longer featured");
      router.refresh();
    });

  return (
    <>
      <PageHeader
        title="Blog"
        description="Your Medium stories. The site lists them and links out to Medium. New stories sync from your feed every day."
        actions={
          <>
            <Button variant="outline" onClick={sync} disabled={syncing || !feedUrl}>
              <RefreshCw className={cn(syncing && "animate-spin")} />
              {syncing ? "Syncing…" : "Sync now"}
            </Button>
            <Button onClick={() => setDialog({ open: true, post: null })}>
              <Plus />
              Add story
            </Button>
          </>
        }
      />

      {feedUrl ? (
        <p className="mb-4 text-xs text-muted-foreground">
          Feed: <span className="font-mono">{feedUrl}</span> ·{" "}
          {syncedLabel ? `Last synced ${syncedLabel}` : "Not synced yet"}
        </p>
      ) : (
        <Card className="mb-4 border-amber-500/40">
          <CardContent className="text-sm">
            Add your Medium profile link (e.g. https://medium.com/@you) in{" "}
            <Link href="/admin/settings" className="font-medium underline underline-offset-2">
              Settings → Socials
            </Link>{" "}
            to sync your stories.
          </CardContent>
        </Card>
      )}

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No stories yet. {feedUrl ? "Click Sync now to pull them from Medium." : ""}
        </p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {posts.map((post) => (
            <li
              key={post.id}
              className={cn("flex items-center gap-3 p-3", post.hidden && "opacity-60")}
            >
              <div className="h-12 w-16 shrink-0 overflow-hidden rounded border bg-muted">
                {post.coverUrl && (
                  // eslint-disable-next-line @next/next/no-img-element -- Medium's CDN thumbnail
                  <img
                    src={mediumImage(post.coverUrl, 160)}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <span className="truncate">{post.title}</span>
                  {post.featured && (
                    <Badge variant="secondary" className="shrink-0 gap-1">
                      <Star className="size-3 fill-current" /> featured
                    </Badge>
                  )}
                </p>
                <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                  {formatDate(post.publishedAt)}
                  <span>· {post.source === "RSS" ? "synced" : "added by hand"}</span>
                  {post.hidden && <span>· hidden</span>}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                aria-label={post.featured ? "Unfeature" : "Feature on the home page"}
                title={post.featured ? "Unfeature" : "Feature on the home page"}
                disabled={pending}
                onClick={() => flag(post, "featured")}
              >
                <Star className={cn(post.featured && "fill-current")} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={post.hidden ? "Show on the site" : "Hide from the site"}
                title={post.hidden ? "Show on the site" : "Hide from the site"}
                disabled={pending}
                onClick={() => flag(post, "hidden")}
              >
                {post.hidden ? <EyeOff /> : <Eye />}
              </Button>
              <Button variant="ghost" size="icon" title="Open on Medium" asChild>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${post.title} on Medium`}
                >
                  <ExternalLink />
                </a>
              </Button>
              {post.source === "MANUAL" && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${post.title}`}
                    onClick={() => setDialog({ open: true, post })}
                  >
                    <Pencil />
                  </Button>
                  <ConfirmDeleteButton
                    itemName={post.title}
                    onConfirm={deleteMediumPost.bind(null, post.id)}
                  />
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <MediumPostDialog
        open={dialog.open}
        post={dialog.post}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
      />
    </>
  );
};
