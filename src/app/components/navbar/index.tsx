"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ToggleButton } from "../theme-toggle";

export const Navbar = () => {
    const navItems = [
        {
            title: 'About',
            href: '/about'
        },
        {
            title: 'Projects',
            href: '/projects'
        },
        {
            title: 'Contact',
            href: '/contact'
        },
        {
            title: 'Blog',
            href: '/blog'
        }
    ]

    const [hovered, setHovered] = useState<number | null>(null);
    const { scrollY } = useScroll();

    const [scrolled, setScrolled] = useState<boolean>(false)
    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 20) {
            setScrolled(true)
        } else {
            setScrolled(false);
        }
    })

    const y = useTransform(scrollY, [0, 100], [0, 10]);
    const width = useTransform(scrollY, [0, 100], ["min(92%, 56rem)", "min(88%, 48rem)"]);

    return (
        <motion.nav
            style={{
                boxShadow: scrolled ? 'var(--shadow-md) ' : 'none',
                y,
                width
            }}
            transition={{
                duration: 0.3,
                ease: "linear"
            }}
            className='fixed inset-x-0 top-3 z-50 mx-auto flex items-center justify-between rounded-full border border-neutral-200 bg-white px-3 py-2 text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 md:px-4'>
            <Link href={'/'} className="shrink-0">
                <Image
                    className='h-10 w-10 rounded-full object-cover'
                    src={'/young-bearded-man-with-striped-shirt.jpg'}
                    height='188'
                    width='188'
                    alt="Sumit avatar"
                    priority
                />
            </Link>


            <div className="flex items-center gap-1 md:gap-2">
                {navItems.map((item, idx) => (
                    <Link
                        className='relative px-2 py-1 text-sm'
                        href={item.href}
                        key={item.href}
                        onMouseEnter={() => setHovered(idx)}
                        onMouseLeave={() => setHovered(null)}
                    >{hovered === idx && (
                        <motion.span layoutId='hovered-span' className='absolute inset-0 h-full w-full rounded-md bg-neutral-200 dark:bg-neutral-800' />

                    )

                        }
                        <span className='relative z-10'>{item.title}</span>
                    </Link>
                ))}
                <ToggleButton />
            </div>

        </motion.nav>
    )

}
