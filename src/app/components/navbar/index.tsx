"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ToggleButton } from "../theme-toggle";
import { HamburgerButton } from "../hamburger";

export const Navbar = () => {
    const navItems = [
        // {
        //     title: 'About',
        //     href: '/about'
        // },
        
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
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const pathname = usePathname();
    const router = useRouter();
    const isHome = pathname === "/";
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

    const handleProfileClick = () => {
        if (isHome) {
            window.dispatchEvent(new Event("open-profile"));
            return;
        }

        router.push("/");
    };

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
            className='fixed inset-x-0 top-3 z-50 mx-auto rounded-3xl border border-neutral-200 bg-white text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100'>
            <div className="flex items-center justify-between px-3 py-2 md:px-4">
                <button
                    type="button"
                    onClick={handleProfileClick}
                    aria-label={isHome ? "Open Sumit's profile" : "Go to homepage"}
                    className="shrink-0 rounded-full transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                >
                    <Image
                        className="h-10 w-10 rounded-full object-cover"
                        src="/profile.png"
                        height={188}
                        width={188}
                        alt="Profile avatar"
                        priority
                    />
                </button>
                <div className="flex items-center gap-1 md:gap-2">
                    {navItems.map((item, idx) => (
                        <Link
                            className='hidden relative px-2 py-1 text-sm md:block'
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

                    <div className="md:hidden">
                        <HamburgerButton isOpen={mobileOpen} onClick={() => setMobileOpen((prev) => !prev)} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden md:hidden"
                    >
                        <div className="flex flex-col gap-1 border-t border-neutral-200 px-3 py-2 dark:border-neutral-800">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-md px-2 py-2 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800"
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )

}
