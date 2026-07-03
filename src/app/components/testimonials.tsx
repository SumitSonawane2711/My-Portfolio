"use client";

import React from 'react';
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { SectionHeading } from './section-heading';

export const Testimonials = () => {
    const data = [
        {
            quote: "Working with sumit has been a fantastic experience! his technical experience and problem-solving skills are top-notch.",
            name: "John Doe",
            avatar: "/young-bearded-man-with-striped-shirt.jpg"
        },
        {
            quote: "Sumit consistently delivers high-quality work ahead of schedule. Highly recommended for any project.",
            name: "Jane Smith",
            avatar: "/young-bearded-man-with-striped-shirt.jpg"
        },
        {
            quote: "His attention to detail and commitment to excellence set him apart from other developers.",
            name: "Michael Lee",
            avatar: "/young-bearded-man-with-striped-shirt.jpg"
        },
        {
            quote: "Sumit is a true professional. Communication was smooth and the results exceeded expectations.",
            name: "Emily Clark",
            avatar: "/young-bearded-man-with-striped-shirt.jpg"
        },
        {
            quote: "I appreciate Sumit's creative solutions and ability to tackle complex challenges with ease.",
            name: "David Kim",
            avatar: "/young-bearded-man-with-striped-shirt.jpg"
        },
        {
            quote: "Sumit brought our vision to life with his expertise and dedication. We couldn't be happier.",
            name: "Sophia Turner",
            avatar: "/young-bearded-man-with-striped-shirt.jpg"
        }
    ]
    return (
        <div className='py-10'>
            <SectionHeading delay={0.8}>
                What Our Clients Say
            </SectionHeading>
            <div className="flex [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%, transparent)]">
                <Marquee speed={25} pauseOnHover gradient={false} className='py-4'>
                    {data.map((item, index) => (
                        <TestimonialCard key={index} {...item} />
                    ))}
                </Marquee>
            </div>

        </div>
    )
}


const TestimonialCard = ({ quote, name, avatar }: { quote: string, name: string, avatar: string }) => {
    return (
        <div className='mx-2 flex h-50 w-full max-w-60 flex-col justify-between gap-4 rounded-xl border border-neutral-200 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-950'>
            <p className='text-sm text-primary'>{quote}</p>
            <div className='flex items-center  gap-4'>
                <Image
                    src={avatar}
                    alt={name}
                    height={40}
                    width={40}
                    className='size-10 rounded-full object-cover'
                />
                <p className='text-sm text-secondary'>{name}</p>
            </div>


        </div>
    )
}
