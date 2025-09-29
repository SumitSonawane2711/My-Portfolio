"use client";
import React, { use, useState } from 'react'
import Container from '../container'
import Image from 'next/image'
import { Link } from 'next-view-transitions'
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion"
import { ToggleButton } from '../theme-toggle';

export const Navbar = () => {
    const navItmes = [
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
    const width = useTransform(scrollY, [0, 100], ["60%", "50%"]);

    return (
        <Container >
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
                className='fixed inset-x-0 top-0 z-50 mx-auto flex max-w-4xl items-center bg-white justify-between px-4 py-2.5 rounded-full '>
                <Link href={'/'}>
                    <Image
                        className='h-10 w-10 rounded-full'
                        src={'/avatar.jpg'}
                        height='188'
                        width='188'
                        alt="Avatar"
                    />
                </Link>


                <div>
                    {navItmes.map((item, idx) => (
                        <Link
                            className='relative px-2 py-1 text-sm'
                            href={item.href}
                            key={idx}
                            onMouseEnter={() => setHovered(idx)}
                            onMouseLeave={() => setHovered(null)}
                        >{hovered === idx && (
                            <motion.span layoutId='hovered-span' className='h-full w-full absolute inset-0 rounded-md bg-neutral-200' />

                        )

                            }
                            <span className='relative z-10'>{item.title}</span>
                        </Link>
                    ))}
                    <ToggleButton/>
                </div>
                
            </motion.nav>
        </Container>
    )

}
