import { CloudImage } from "@/shared/components/CloudImage";
import { RichText } from "@/shared/components/RichText";

type FreelanceAboutProps = {
  title: string;
  text: string;
  name: string;
  /** The freelance portrait, or the site avatar as a fallback. */
  imagePublicId: string | null;
};

export const FreelanceAbout = ({ title, text, name, imagePublicId }: FreelanceAboutProps) => {
  if (!text) return null;

  return (
    <section
      id="about"
      data-tone="dark"
      aria-labelledby="about-title"
      className="bg-neutral-950 py-24 text-white md:py-32"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-10">
        <div className="reveal">
          <h2 id="about-title" className="text-3xl font-bold tracking-tight md:text-5xl">
            {title}
          </h2>
          <RichText
            text={text}
            className="mt-8 text-lg leading-relaxed text-neutral-400"
            boldClassName="text-white"
          />
        </div>
        {imagePublicId && (
          <div className="reveal relative mx-auto aspect-[4/5] w-full max-w-60 overflow-hidden rounded-[2rem] sm:max-w-sm md:max-w-md">
            <CloudImage
              publicId={imagePublicId}
              alt={name}
              fill
              sizes="(min-width: 768px) 448px, (min-width: 640px) 384px, 240px"
              className="object-cover"
            />
            {/* No box colour behind the photo, so a cut-out (transparent PNG)
                portrait sits straight on the dark section. Soft fade at the
                bottom into the section. */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-neutral-950/70 to-transparent"
            />
          </div>
        )}
      </div>
    </section>
  );
};
