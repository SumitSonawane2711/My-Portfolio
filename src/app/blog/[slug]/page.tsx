import Container from "@/app/components/container";
import { getBlogFrontmatterBySlug, getSingleBlog } from "@/utils/mdx";
import Image from "next/image";
import { redirect } from "next/navigation";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;

    const frontmatter = await getBlogFrontmatterBySlug(slug)
    
    if (!frontmatter) {
        return {
            title: "Blog Not Found"
        }
    }

    return {
        title: frontmatter.title + " - Sumit Sonawane",
        description: frontmatter.description,
    };
}

export default async function SingleBlogpage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const blog = await getSingleBlog(slug)

    if (!blog) {
        redirect('/blog')
    }

    const { content, frontmatter } = blog;



    return (
        <main className="min-h-screen flex items-start justify-start ">
            <Container className="min-h-screen p-4 md:pt-20 md:pb-10">
                <Image
                    src={frontmatter.image || "/blog.jpg"}
                    alt={frontmatter.title}
                    height={500}
                    width={900}
                    className=" rounded-lg  mx-auto max-h-96 w-full border border-neutral-200 mb-20 shadow-xl"
                />
                <div className="prose  ">
                    {content}
                </div>
            </Container>
        </main>
    );
}




