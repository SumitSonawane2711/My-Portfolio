import {  IconBrandGithub, IconBrandLinkedin, IconBrandX } from "@tabler/icons-react";
import Link from "next/link";
import Container from "../container";

export const Footer = () => {
    return (
        <Container className="flex justify-between border-t border-neutral-200 px-2 py-4 dark:border-neutral-800">
            <p className="text-md text-secondary">Build with Love by Sumit</p>
            <div className="flex items-center justify-center gap-4">
                {/* <Link href="#">
                <IconBrandX className="size-4 text-secondary hover:text-primary" />
                </Link> */}
                <Link href="https://github.com/SumitSonawane2711">
                    <IconBrandGithub className="size-4 text-secondary hover:text-primary" />
                </Link>
                <Link href="https://in.linkedin.com/in/sumit-sonawane-2b504b219">
                    <IconBrandLinkedin className="size-4 text-secondary hover:text-primary" />
                </Link>
            </div>
        </Container>
    );
};
