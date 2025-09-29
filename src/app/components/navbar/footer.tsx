import {  IconBrandGithub, IconBrandLinkedin, IconBrandX } from "@tabler/icons-react";
import { Link } from "next-view-transitions";
import Container from "../container";

export const Footer = () => {
    return (
        <Container className="flex  justify-between px-2 py-4 border-t border-neutral-200">
            <p className="text-md text-neutral-500">Build with Love by Sumit</p>
            <div className="flex item-center justify-center gap-4 ">
                <Link href="#">
                <IconBrandX className="size-4 text-neutral-500 hover-neutral-700" />
                </Link>
                <Link href="#">
                    <IconBrandGithub className="size-4 text-neutral-500 hover-neutral-700" />
                </Link>
                <Link href="#">
                    <IconBrandLinkedin className="size-4 text-neutral-500 hover-neutral-700" />
                </Link>
            </div>
        </Container>
    );
};
