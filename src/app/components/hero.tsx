import Link from "next/link"
import { Heading } from "./heading"
import { SubHeading } from "./subheading"
import { IconBrandGithub, IconBrandLinkedin, IconBrandX } from "@tabler/icons-react"

export const Hero = async () => {
    return (
        <section className="pt-10">
             <Heading>Hello, I am Sumit</Heading>
        <SubHeading >
          Motivated and detail-oriented MERN Stack Developer with 2+ years of professional experience in developing and maintaining dynamic web applications. Proficient in React.js, Node.js, Express.js. Demonstrated ability to work collaboratively in a team environment and effectively manage individual project tasks. Passionate about coding, continuously learning, and eager to contribute to innovative projects. Currently seeking a challenging position to leverage my skills and grow as a professional in a dynamic and growth-oriented company.       
        </SubHeading>
        <div className="flex items-start gap-4 mt-4">
                <Link href="#">
                <IconBrandX className="size-4 text-secondary hover:text-primary" />
                </Link>
                <Link href="#">
                    <IconBrandGithub className="size-4 text-secondary hover:text-primary" />
                </Link>
                <Link href="#">
                    <IconBrandLinkedin className="size-4 text-secondary hover:text-primary" />
                </Link>
            </div>     
        </section>
    )
}