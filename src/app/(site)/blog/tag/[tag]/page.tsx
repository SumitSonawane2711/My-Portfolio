import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListPage } from "@/features/blog/components/BlogListPage";
import { getPostsByTag, getTags } from "@/features/blog/queries/blogQueries";

interface PageProps {
  params: Promise<{ tag: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getTags()).map(({ slug }) => ({ tag: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const result = await getPostsByTag(tag);
  return result ? { title: `#${result.tag.name} - Blog` } : { title: "Tag not found" };
}

export default async function BlogTagPage({ params }: PageProps) {
  const { tag } = await params;
  const result = await getPostsByTag(tag);
  if (!result || result.posts.length === 0) notFound();
  return <BlogListPage posts={result.posts} tag={result.tag} />;
}
