import type { ReactNode } from "react";
import Link from "next/link";
import { CloudImage } from "@/shared/components/CloudImage";
import { Container } from "@/shared/components/Container";
import { ContentRenderer } from "@/shared/components/ContentRenderer";
import { Heading } from "@/shared/components/Heading";
import { formatDate } from "@/shared/libs/format";
import type { BlogPost } from "../interfaces/blog";
import { TableOfContents } from "./TableOfContents";

type PostArticleProps = {
  post: BlogPost;
  /** Shown above the article (the admin preview banner). */
  banner?: ReactNode;
  /** Shown after the content (likes, feedback, related posts). */
  footer?: ReactNode;
};

// The article layout, shared by the public page and the admin preview. Keeps
// the original look (cover image + prose), adding a title and meta line
// because posts written in the editor don't carry their own heading.
export const PostArticle = ({ post, banner, footer }: PostArticleProps) => {
  return (
    <main className="flex min-h-screen items-start justify-start">
      <Container className="min-h-screen p-4 pt-20 md:pb-10">
        {banner}
        {post.coverPublicId && (
          <CloudImage
            publicId={post.coverPublicId}
            alt={post.coverAlt || post.title}
            height={post.coverHeight ?? 500}
            width={post.coverWidth ?? 900}
            sizes="(max-width: 896px) 100vw, 896px"
            priority
            className="mx-auto mb-20 max-h-96 w-full rounded-lg border border-neutral-200 object-cover shadow-xl dark:border-neutral-800"
          />
        )}
        <Heading className="mb-2">{post.title}</Heading>
        <p className="mb-8 text-sm text-secondary">
          {formatDate(post.publishedAt)} · {post.readingMinutes} min read
          {post.tags.length > 0 && (
            <>
              {" · "}
              {post.tags.map((tag, index) => (
                <span key={tag.slug}>
                  {index > 0 && ", "}
                  <Link href={`/blog/tag/${tag.slug}`} className="hover:text-primary">
                    #{tag.name}
                  </Link>
                </span>
              ))}
            </>
          )}
        </p>
        <TableOfContents items={post.toc} />
        <ContentRenderer html={post.contentHtml} />
        {footer}
      </Container>
    </main>
  );
};
