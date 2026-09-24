import type { ReactNode } from "react";
import Image from "next/image";
import { Container } from "@/shared/components/Container";
import type { BlogFrontmatter } from "../interfaces/blog";

type BlogDetailViewProps = {
  content: ReactNode;
  frontmatter: BlogFrontmatter;
};

export const BlogDetailView = ({ content, frontmatter }: BlogDetailViewProps) => {
  return (
    <main className="flex min-h-screen items-start justify-start">
      <Container className="min-h-screen p-4 pt-20 md:pb-10">
        <Image
          src={frontmatter.image || "/blog.jpg"}
          alt={frontmatter.title}
          height={500}
          width={900}
          className="mx-auto mb-20 max-h-96 w-full rounded-lg border border-neutral-200 shadow-xl dark:border-neutral-800"
        />
        <div className="prose prose-neutral dark:prose-invert">{content}</div>
      </Container>
    </main>
  );
};
