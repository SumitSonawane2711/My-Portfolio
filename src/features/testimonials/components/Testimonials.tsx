"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import { CloudImage } from "@/shared/components/CloudImage";
import { SectionHeader } from "@/shared/components/SectionHeader";
import type { TestimonialCard as TestimonialCardData } from "../interfaces/testimonial";

// Same marquee design as the original placeholder section, now fed by the
// dashboard. Rendered only when at least one testimonial is visible.
export const Testimonials = ({ items }: { items: TestimonialCardData[] }) => {
  return (
    <section aria-labelledby="testimonials-title" className="py-12 sm:py-16">
      <SectionHeader
        id="testimonials-title"
        title="Testimonials"
        description={
          <>
            What <span className="highlight">people I&apos;ve worked with</span> say.
          </>
        }
      />
      <div className="mt-4 flex [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
        <Marquee speed={25} pauseOnHover gradient={false} className="py-4">
          {items.map((item) => (
            <TestimonialCard key={item.id} {...item} />
          ))}
        </Marquee>
      </div>
    </section>
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
    <figure className="mx-2 flex h-52 w-full max-w-64 flex-col justify-between gap-4 card-chai p-5">
      <blockquote className="line-clamp-5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        “{quote}”
      </blockquote>
      <figcaption className="flex items-center gap-3">
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
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-500/15 text-xs font-semibold text-muted-foreground ring-1 ring-card-edge">
            {initials(name)}
          </span>
        )}
        <div>
          <p className="font-montserrat text-sm font-semibold text-gray-900 dark:text-gray-50">
            {name}
          </p>
          {byline && <p className="text-xs text-muted-foreground">{byline}</p>}
        </div>
      </figcaption>
    </figure>
  );
};
