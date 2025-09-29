    "use client";
    import { cn } from '@/lib/utils'
    import React from 'react'
    import { motion } from 'motion/react';

    export const Heading = (
        { as: Tag = "h1", children, className }:
            { as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6", children: React.ReactNode, className?: string }
    ) => {
        return (
            <motion.div
                initial={{ opacity: 0, filter: "blur(10px)", x: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut"
                }}
                viewport={{ once: true }}
            >
                <Tag className={cn('text-2xl drop-shadow-md md:text-4xl font-bold tracking-tighter text-primary', className)}>
                    {children}
                </Tag>
            </motion.div>
        )
    }
