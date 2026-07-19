import { getBlogs } from '@/utils/mdx';
import Link from 'next/link';
import React from 'react'
import { SectionHeading } from './section-heading';

export const Landingblog = async () => {

    const allblogs = (await getBlogs())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);

    const truncate = (str: string, n: number) => {
        return str.length > n ? str.substring(0, n) + '...' : str;
    }

    return (
        <section className="py-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <SectionHeading delay={0.3}>
                    Blog | A collection of my thoughts, insights, and experiences of my journey in development.
                </SectionHeading>
                <Link href="/blog" className="text-sm font-medium text-primary">
                    View all posts
                </Link>
            </div>
            <div className="mt-6 flex flex-col gap-3">
                {allblogs.map((blog) =>
                    <Link
                        href={`/blog/${blog.slug}`}
                        key={blog.slug}
                        className="block rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-900/70"
                    >
                        <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                            <h3 className="text-base font-semibold tracking-tight text-primary">
                                {blog.title}
                            </h3>
                            <p className="shrink-0 text-sm text-secondary">
                                {new Date(blog.date || "").toLocaleDateString('en-us', {
                                    month: 'short', day: 'numeric', year: 'numeric'
                                })}
                            </p>
                        </div>

                        <p className="max-w-2xl pt-2 text-sm text-secondary">
                            {truncate(blog.description || "", 150)}
                        </p>
                    </Link>)}
            </div>
        </section>

    )
}
