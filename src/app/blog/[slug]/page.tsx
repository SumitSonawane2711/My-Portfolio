import { redirect } from "next/navigation";
import { BlogDetailView } from "@/features/blog/components/BlogDetailView";
import { getBlogFrontmatterBySlug, getSingleBlog } from "@/features/blog/services/blogServices";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const frontmatter = await getBlogFrontmatterBySlug(slug);

  if (!frontmatter) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: frontmatter.title + " - Sumit Sonawane",
    description: frontmatter.description,
  };
}

export default async function SingleBlog({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getSingleBlog(slug);

  if (!blog) {
    redirect("/blog");
  }

  return <BlogDetailView content={blog.content} frontmatter={blog.frontmatter} />;
}
