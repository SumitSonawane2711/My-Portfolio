import path from "path";
import { promises as fs } from "fs";
import { compileMDX } from "next-mdx-remote/rsc";

type Frontmatter = {
    title: string,
    description: string,
    date: string,
    image?: string,
}

export const getSingleBlog = async (slug: string) => {
    try {
        const singleBlog = await fs.readFile(
            path.join(process.cwd(), "src/data", `${slug}.mdx`), "utf-8",
        );

        if (!singleBlog) {
            return null;
        }

        const { content, frontmatter } = await compileMDX<{ title: string }>({
            source: singleBlog,
            options: { parseFrontmatter: true },
        })

        return { content, frontmatter };
    } catch (error) {
        console.error("Error reading blog file:", error);
        return null;
    }
}

export const getBlogs = async () => {
    const files = await fs.readdir(path.join(process.cwd(), "src/data"));

    const allBlogs = await Promise.all(files.map(async (file) => {
        const slug = file.replace(".mdx", "");
        
        const frontmatter = await getBlogFrontmatterBySlug(slug);
        return { slug, ...frontmatter };
    }));

    return allBlogs;
}


export const getBlogFrontmatterBySlug = async (slug: string) => {
    const singleBlog = await fs.readFile(
        path.join(process.cwd(), "src/data", `${slug}.mdx`), "utf-8",
    );

    if (!singleBlog) {
        return null;
    }

    const { frontmatter } = await compileMDX<Frontmatter>({
        source: singleBlog,
        options: { parseFrontmatter: true },
    });

    return frontmatter;
}
