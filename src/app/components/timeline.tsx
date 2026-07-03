'use client'
import React, { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { IconCircleCheckFilled } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
type data = {
    year: number;
    content: {
        title: string;
        description: string;
    }[];
}
export const Timeline = () => {
    const ref = useRef<HTMLDivElement>(null)
    const isInview = useInView(ref, { once: true, amount: 0.6 })
    const data: data[] = [
        {
            year: 2025,
            content: [
                {
                    title: "senior developer",
                    description: "As a senior developer, I led a team of engineers to build scalable web applications using React and Node.js."
                }
            ]
        },
        {
            year: 2024,
            content: [
                {
                    title: "lead developer",
                    description: "As a lead developer, I was responsible for overseeing the development team and ensuring the successful delivery of projects."
                }
            ]
        },
        {
            year: 2023,
            content: [
                {
                    title: "junior developer",
                    description: "As a junior developer, I worked on various projects using React and Node.js."
                }
            ]
        }
    ]
    return (
        <div ref={ref} className='py-10'>
            {data.map((year, idx) => (
                <div key={year.year} className='mb-4'>
                    <motion.h2
                        animate={{
                            filter: isInview ? "blur(0px)" : 'blur(10px)',
                            opacity: isInview ? 1 : 0
                        }}
                        transition={{
                            duration: 0.3,
                            ease: 'easeInOut',
                            delay: 0.1 * idx,
                        }}

                        className='font-bold text-primary'>
                        {year.year}
                    </motion.h2>
                    <div className='flex flex-col gap-4'>
                        {year.content.map((item, idx) => (
                            <div key={item.title} className='pl-4'>
                                <Step isInview={isInview} idx={idx}>
                                    <motion.h3
                                        animate={{
                                            opacity: isInview ? 1 : 0,
                                            y: isInview ? 0 : 10
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            ease: 'easeInOut',
                                            delay: 0.1 * idx,
                                        }}
                                        className='text-primary'
                                    >{item.title}</motion.h3>
                                </Step>

                                {item.description && <p className='pt-1 text-secondary'>{item.description}</p>}
                            </div>
                        ))}
                    </div>

                </div>
            ))}
        </div>
    )
}

const Step = (
    { children, className,isInview,idx }: { children: React.ReactNode; className?: string, isInview: boolean, idx: number }) => {
    return <motion.div 
    animate={{
        opacity:isInview ? 1 : 0,
        y: isInview ? 0 : 10
    }}
    transition={{
        duration:0.3,
        ease: 'easeInOut',
        delay: 0.2 * idx
    }}
    className={cn('flex items-start gap-2', className)}>
        <IconCircleCheckFilled className='mt-1.5 h-4 w-4 text-secondary' />
        {children}
    </motion.div>
}
