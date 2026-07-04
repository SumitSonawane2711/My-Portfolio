import Link from "next/link"
import { Heading } from "./heading"
import { SubHeading } from "./subheading"
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react"
import { DownloadResume } from "./download-resume"

export const Hero = async () => {
    return (
        <section className="pt-10">
             <Heading>Hello, I am Sumit</Heading>
        <SubHeading >
          Motivated and detail-oriented MERN Stack Developer with 2+ years of professional experience in developing and maintaining dynamic web applications. Proficient in React.js, Node.js, Express.js. Demonstrated ability to work collaboratively in a team environment and effectively manage individual project tasks.
        </SubHeading>
        <div className="flex items-center gap-4 mt-4">
               
                <Link href="https://github.com/SumitSonawane2711">
                    <IconBrandGithub className="size-5 text-secondary hover:text-primary" />
                </Link>
                <Link href="https://in.linkedin.com/in/sumit-sonawane-2b504b219">
                    <IconBrandLinkedin className="size-5 text-secondary hover:text-primary" />
                </Link>
                <DownloadResume />
            </div>     
        </section>
    )
}