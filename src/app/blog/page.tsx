import { Metadata } from "next";
import Container from "../components/container";
import { getBlogs } from "@/utils/mdx";
import Link from 'next/link'
import { Heading } from "../components/heading";
import { SubHeading } from "../components/subheading";


export const metadata: Metadata = {
    title: "All Blogs - Sumit Sonawane",
    description: "All Blogs by sumit"
}

export default async function Blogspage() {

    const allblogs = (await getBlogs())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const truncate = (str: string, n: number) => {
        return str.length > n ? str.substring(0, n) + '...' : str;
    }
    return (
        <main className="min-h-screen flex items-start justify-start ">
            <Container className="min-h-screen p-4 md:pt-20 md:pb-10">
                <Heading >
                    Writing
                </Heading>
                <SubHeading >
                    Practical notes, experiments, and lessons from building full-stack web applications.
                </SubHeading>
                <div className="mt-10 flex flex-col gap-4">
                    {allblogs.map((blog) =>
                        <Link
                            href={`/blog/${blog.slug}`}
                            key={blog.slug}
                            className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-900/70"
                        >
                            <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                                <h2 className="text-base font-semibold tracking-tight text-primary">
                                    {blog.title}
                                </h2>
                                <p className="shrink-0 text-sm text-secondary">
                                    {new Date(blog.date || "").toLocaleDateString('en-us', {
                                        month: 'short', day: 'numeric', year: 'numeric'
                                    })}
                                </p>
                            </div>

                            <p className="max-w-2xl pt-2 text-sm text-secondary">
                                {truncate(blog.description || "", 180)}
                            </p>
                        </Link>)}
                </div>
            </Container>
        </main>
    );
}
