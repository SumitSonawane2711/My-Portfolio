'use client'
import Image from 'next/image'
import React from 'react'
import { motion } from 'motion/react'
import { Project, projects as defaultProjects } from '../constants/projects'
import { SectionHeading } from './section-heading'
import Link from 'next/link'

export const Projects = ({ projects = defaultProjects }: { projects: Project[] }) => {

    return (
        <div className='py-10'>
            <SectionHeading delay={0.3}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum in animi qui nesciunt obcaecati magnam?
            </SectionHeading>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3 py-4'>
                {projects.map((project, idx) =>
                    <Link href={`/projects/${project.slug}`} key={project.title} >
                        <motion.div
                            initial={{ opacity: 0, filter: 'blur(10px)', y: 50 }}
                            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: idx * 0.1,
                                ease: 'easeInOut'
                            }}
                            key={project.title}
                            className=' group rounded-lg shadow-lg transition duration-200 hover:scale-105'
                        >


                            <Image
                                src={project.src}
                                alt={project.title}
                                height={500}
                                width={500}
                                className='h-54 w-full rounded-t-xl object-cover  transition duration-200'
                            />
                            <div className='p-4'>
                                <h2 className='max-w-lg pt-4 text-sm font-semibold text-primary md:text-base'>{project.title}</h2>
                                <p className='max-w-lg text-sm font-normal text-secondary md:text-sm'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero, doloribus?</p>
                            </div>
                        </motion.div>
                    </Link>
                )}
            </div>

        </div>
    )
}
