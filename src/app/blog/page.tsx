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

    const allblogs = await getBlogs();
    const truncate = (str: string, n: number) => {
        return str.length > n ? str.substring(0, n) + '...' : str;
    }
    return (
        <main className="min-h-screen flex items-start justify-start ">
            <Container className="min-h-screen p-4 md:pt-20 md:pb-10">
                <Heading >
                    All Blogs
                </Heading>
                <SubHeading >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, unde facere! Necessitatibus numquam iusto assumenda. Ullam quaerat exercitationem nesciunt porro!
                </SubHeading>
                <div className="flex flex-col gap-10">
                    {allblogs.map((blog)=> 
                    <Link href={`/blog/${blog.slug}`} key={blog.slug}>
                        <div className="flex items-center justify-between">
                            <h2 className=" text-primary text-base tracking-tight font-bold ">
                            {blog.title}
                        </h2>
                        <p className="text-secondary max-w-lg pt-2 text-sm md:text-sm">
                            {new Date(blog.date || "").toLocaleDateString('en-us',{
                                weekday: 'long',year: 'numeric', month: 'short', day: 'numeric'}) }
                        </p>
                        </div>
                        
                        <p className="text-secondary max-w-lg pt-2 text-sm md:text-sm">
                            {truncate(blog.description || "", 150)}
                        </p>
                    </Link>)}
                </div>
            </Container>
        </main>
    );
}
