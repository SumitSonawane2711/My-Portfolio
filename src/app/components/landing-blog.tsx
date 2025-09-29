import { getBlogs } from '@/utils/mdx';
import { Link } from 'next-view-transitions';
import React from 'react'

export const Landingblog = async () => {

    const allblogs = await getBlogs();
    const truncate = (str: string, n: number) => {
        return str.length > n ? str.substring(0, n) + '...' : str;
    }

    return (
        <div className="">
            <p className="text-secondary max-w-lg pt-4 text-sm md:text-sm">
                I love to write the my experince and thoughts through
            </p>
            <div className="flex flex-col gap-4">
                {allblogs.map((blog, idx) =>
                    <Link href={`blog/${blog.slug}`} key={idx}>
                        <div className="flex items-center justify-between">
                            <h2 className=" text-primary text-base tracking-tight font-bold ">
                                {blog.title}
                            </h2>
                            <p className="text-secondary max-w-lg pt-2 text-sm md:text-sm">
                                {new Date(blog.date || "").toLocaleDateString('en-us', {
                                    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
                                })}
                            </p>
                        </div>

                        <p className="text-secondary max-w-lg pt-2 text-sm md:text-sm">
                            {truncate(blog.description || "", 150)}
                        </p>
                    </Link>)}
            </div>
        </div>

    )
}
