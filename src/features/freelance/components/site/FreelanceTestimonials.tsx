import { CloudImage } from "@/shared/components/CloudImage";
import { RichText } from "@/shared/components/RichText";
import type { TestimonialCard } from "@/features/testimonials/interfaces/testimonial";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// Only rendered when at least one testimonial is marked for /freelance.
export const FreelanceTestimonials = ({ items }: { items: TestimonialCard[] }) => {
  if (items.length === 0) return null;

  return (
    <section
      id="testimonials"
      data-tone="dark"
      aria-labelledby="testimonials-title"
      className="bg-neutral-950 py-24 text-white md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <h2
          id="testimonials-title"
          className="reveal text-3xl font-bold tracking-tight md:text-5xl"
        >
          What clients say about working together
        </h2>
        <div className="mt-12 gap-6 md:columns-2">
          {items.map((item) => (
            <figure
              key={item.id}
              className="reveal mb-6 break-inside-avoid rounded-3xl bg-white/[0.06] p-8 ring-1 ring-white/10"
            >
              <blockquote className="text-lg leading-relaxed text-neutral-300">
                <RichText text={`“${item.quote}”`} boldClassName="text-white" />
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-4">
                {item.avatarPublicId ? (
                  <CloudImage
                    publicId={item.avatarPublicId}
                    alt=""
                    width={56}
                    height={56}
                    crop="fill"
                    className="size-14 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex size-14 items-center justify-center rounded-full bg-neutral-800 text-sm font-semibold text-neutral-300">
                    {initials(item.name)}
                  </span>
                )}
                <span className="border-l border-white/20 pl-4">
                  <span className="block font-semibold text-white">{item.name}</span>
                  {item.byline && (
                    <span className="block text-sm text-neutral-400">{item.byline}</span>
                  )}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
