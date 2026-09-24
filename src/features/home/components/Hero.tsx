import Link from "next/link";
import { Heading } from "@/shared/components/Heading";
import { SubHeading } from "@/shared/components/SubHeading";
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";
import { SOCIAL_LINKS } from "@/shared/constants/site";

export const Hero = async () => {
  return (
    <section className="pt-10">
      <Heading>Hello, I am Sumit</Heading>
      <SubHeading>
        Motivated and detail-oriented MERN Stack Developer with 2+ years of professional experience
        in developing and maintaining dynamic web applications. Proficient in React.js, Node.js,
        Express.js. Demonstrated ability to work collaboratively in a team environment and
        effectively manage individual project tasks.
      </SubHeading>
      <div className="mt-4 flex items-center gap-4">
        <Link href={SOCIAL_LINKS.github}>
          <IconBrandGithub className="size-5 text-secondary hover:text-primary" />
        </Link>
        <Link href={SOCIAL_LINKS.linkedin}>
          <IconBrandLinkedin className="size-5 text-secondary hover:text-primary" />
        </Link>
        {/* <DownloadResume /> */}
      </div>
    </section>
  );
};
