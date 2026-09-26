import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostArticle } from "@/features/blog/components/PostArticle";
import { ReadingProgress } from "@/features/blog/components/ReadingProgress";
import { RelatedPosts } from "@/features/blog/components/RelatedPosts";
import { getPost, getPostSlugs, getRelatedPosts } from "@/features/blog/queries/blogQueries";
import { getSettings } from "@/features/settings/queries/settingsQueries";
import { clientEnv } from "@/shared/configs/clientEnv";
import { cldUrl } from "@/shared/libs/cloudinaryUrl";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getPostSlugs()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Blog Not Found" };

  const title = post.seoTitle || `${post.title} - Sumit Sonawane`;
  const description = post.seoDescription || post.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      tags: post.tags.map((t) => t.name),
      // Without a cover, the generated opengraph-image.tsx is used.
      images: post.coverPublicId
        ? [cldUrl(post.coverPublicId, { width: 1200, height: 630, crop: "fill" })]
        : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const [related, settings] = await Promise.all([
    getRelatedPosts(
      post.id,
      post.tags.map((t) => t.slug),
    ),
    getSettings(),
  ]);

  // Structured data so search engines understand the article.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    url: `${clientEnv.siteUrl}/blog/${post.slug}`,
    author: { "@type": "Person", name: settings.name, url: clientEnv.siteUrl },
    ...(post.coverPublicId && {
      image: cldUrl(post.coverPublicId, { width: 1200, height: 630, crop: "fill" }),
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output can't contain "</script>" once "<" is escaped.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ReadingProgress />
      <PostArticle post={post} interactive footer={<RelatedPosts posts={related} />} />
    </>
  );
}
