"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import { CloudImage } from "@/shared/components/CloudImage";
import { SectionHeading } from "@/shared/components/SectionHeading";
import type { TestimonialCard as TestimonialCardData } from "../interfaces/testimonial";

// Same marquee design as the original placeholder section, now fed by the
// dashboard. Rendered only when at least one testimonial is visible.
export const Testimonials = ({ items }: { items: TestimonialCardData[] }) => {
  return (
    <div className="py-10">
      <SectionHeading delay={0.8}>What Our Clients Say</SectionHeading>
      <div className="[mask-image:linear-gradient(to_right,transparent,white_10%,white_90%, transparent)] flex">
        <Marquee speed={25} pauseOnHover gradient={false} className="py-4">
          {items.map((item) => (
            <TestimonialCard key={item.id} {...item} />
          ))}
        </Marquee>
      </div>
    </div>
  );
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const TestimonialCard = ({ quote, name, byline, avatarPublicId }: TestimonialCardData) => {
  return (
    <div className="mx-2 flex h-50 w-full max-w-60 flex-col justify-between gap-4 rounded-xl border border-neutral-200 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-950">
      <p className="text-sm text-primary">{quote}</p>
      <div className="flex items-center gap-4">
        {avatarPublicId ? (
          <CloudImage
            publicId={avatarPublicId}
            alt={name}
            height={40}
            width={40}
            crop="fill"
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-secondary dark:bg-neutral-800">
            {initials(name)}
          </span>
        )}
        <div>
          <p className="text-sm text-secondary">{name}</p>
          {byline && <p className="text-xs text-secondary">{byline}</p>}
        </div>
      </div>
    </div>
  );
};
