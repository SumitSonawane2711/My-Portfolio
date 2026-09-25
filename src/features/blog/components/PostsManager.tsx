"use client";

import Link from "next/link";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { Plus } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { formatDate } from "@/shared/libs/format";
import { ConfirmDeleteButton } from "@/features/admin/components/ConfirmDeleteButton";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { createDraft, deletePost } from "../actions/blogActions";
import type { PostAdminRow } from "../interfaces/blog";

const FILTERS = ["all", "DRAFT", "PUBLISHED", "SCHEDULED"] as const;

const STATUS_VARIANT = {
  DRAFT: "outline",
  PUBLISHED: "default",
  SCHEDULED: "secondary",
} as const;

export const PostsManager = ({ posts }: { posts: PostAdminRow[] }) => {
  // Kept in the URL; shallow:false re-runs the server page with the new filter.
  const [status, setStatus] = useQueryState(
    "status",
    parseAsStringLiteral(FILTERS).withDefault("all").withOptions({ shallow: false }),
  );

  return (
    <>
      <PageHeader
        title="Blog"
        description="Drafts autosave while you write. Scheduled posts go live at their date."
        actions={
          <form action={createDraft}>
            <Button type="submit">
              <Plus />
              New post
            </Button>
          </form>
        }
      />

      <Tabs value={status} onValueChange={(v) => void setStatus(v as (typeof FILTERS)[number])}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="DRAFT">Drafts</TabsTrigger>
          <TabsTrigger value="PUBLISHED">Published</TabsTrigger>
          <TabsTrigger value="SCHEDULED">Scheduled</TabsTrigger>
        </TabsList>
      </Tabs>

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts here yet.</p>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Published</TableHead>
                <TableHead className="hidden md:table-cell">Read</TableHead>
                <TableHead className="hidden md:table-cell">Likes</TableHead>
                <TableHead className="hidden lg:table-cell">Updated</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="max-w-64">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="block truncate font-medium hover:underline"
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[post.status]}>{post.status.toLowerCase()}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {post.publishedAt ? formatDate(post.publishedAt) : "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{post.readingMinutes} min</TableCell>
                  <TableCell className="hidden md:table-cell">{post.likes}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {formatDate(post.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <ConfirmDeleteButton
                      itemName={post.title}
                      description="Its likes are deleted; reader messages about it are kept in the inbox."
                      onConfirm={deletePost.bind(null, post.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};
