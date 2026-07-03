"use client"
import React from 'react'
import { motion } from 'motion/react'

export const SectionHeading = ({ children, delay }: { children: string, delay: number }) => {
    return (
        <h2 className='max-w-lg pt-4 text-sm font-normal text-secondary md:text-sm'>
            {children.split(" ").map((word, idx) => (
                <motion.span
                    key={word + idx}
                    initial={{
                        opacity: 0,
                        y: 5,
                        filter: "blur(5px)"
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)"
                    }}
                    transition={{
                        delay: idx * delay * 0.05,
                        duration: 0.3,
                        ease: "easeInOut"
                    }}
                    className='inline-block'
                >
                    {word}&nbsp;
                </motion.span>
            ))}
        </h2>
    )
}

