'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { IconArrowUpRight } from '@tabler/icons-react'
import {
    ProfessionalExperience as ProfessionalExperienceType,
    professionalExperience as defaultExperience,
} from '../constants/professional-experience'
import { SectionHeading } from './section-heading'

export const ProfessionalExperience = ({
    experience = defaultExperience,
}: {
    experience?: ProfessionalExperienceType[]
}) => {
    return (
        <section className='py-10'>
            <div className='flex items-end justify-between gap-4'>
                <div>
                    <h2 className='text-lg font-semibold text-primary'></h2>
                    <SectionHeading delay={0.3}>
                        Professional Experience | Companies and teams I have worked with.
                    </SectionHeading>
                </div>
            </div>
            <div className='flex flex-col gap-4 py-4'>
                {experience.map((item, idx) => (
                    <motion.article
                        key={item.slug}
                        initial={{ opacity: 0, filter: 'blur(10px)', y: 24 }}
                        whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                        transition={{
                            duration: 0.3,
                            delay: idx * 0.1,
                            ease: 'easeInOut',
                        }}
                        className='rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'
                    >
                        <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
                            <div>
                                <Link
                                    href={`${item.url}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-flex items-center gap-1 text-base font-semibold text-primary'
                                >
                                    {item.companyName}
                                    <IconArrowUpRight className='h-4 w-4' />
                                </Link>
                                <p className='pt-1 text-sm font-medium text-primary'>{item.role}</p>
                                <p className='pt-2 text-sm text-secondary'>{item.description}</p>
                            </div>
                            <p className='shrink-0 text-sm text-secondary'>
                                {item.dateFrom} - {item.dateTo}
                            </p>
                        </div>
                        <div className='mt-4 flex flex-wrap gap-2'>
                            {item.technologies.map((technology) => (
                                <span
                                    key={technology}
                                    className='rounded-md border border-neutral-200 px-2 py-1 text-xs text-secondary dark:border-neutral-800'
                                >
                                    {technology}
                                </span>
                            ))}
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    )
}
