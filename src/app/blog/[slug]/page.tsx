import Container from "@/app/components/container";
import { getBlogFrontmatterBySlug, getSingleBlog } from "@/utils/mdx";
import { redirect } from "next/navigation";

export async function generateMetadata({
    params,
}: {
    params: { slug: string }
}) {

    const frontmatter = await getBlogFrontmatterBySlug(params.slug)
    
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
    params: { slug: string }
}) {
    const slug = params.slug;
    const blog = await getSingleBlog(slug)

    if (!blog) {
        redirect('/blog')
    }

    const { content, frontmatter } = blog;



    return (
        <main className="min-h-screen flex items-start justify-start ">
            <Container className="min-h-screen p-4 md:pt-20 md:pb-10">
                <img
                    src={frontmatter.image}
                    alt={frontmatter.title}
                    className=" rounded-lg  mx-auto max-h-96 w-full border border-neutral-200 mb-20 shadow-xl"
                />
                <div className="prose  ">
                    {content}
                </div>
            </Container>
        </main>
    );
}




