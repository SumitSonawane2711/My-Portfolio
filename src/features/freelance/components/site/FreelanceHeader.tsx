"use client";

import { useEffect, useState } from "react";
import { CloudImage } from "@/shared/components/CloudImage";
import { cn } from "@/shared/libs/utils";
import { ContactButton } from "./ContactDialog";
import { MobileMenu } from "./MobileMenu";

export type HeaderLink = { id: string; label: string };

type FreelanceHeaderProps = {
  name: string;
  avatarPublicId: string | null;
  available: boolean;
  links: HeaderLink[];
  /** Digits with country code (for the WhatsApp button in the mobile menu). */
  whatsapp: string | null;
  /** Where the section links point: "" on /freelance, "/freelance" elsewhere. */
  base?: string;
};

const HEADER_HEIGHT = 96;

// Sticky header: the link of the section in view is underlined, and the colours
// follow the section underneath (sections carry data-tone="light" | "dark").
export const FreelanceHeader = ({
  name,
  avatarPublicId,
  available,
  links,
  whatsapp,
  base = "",
}: FreelanceHeaderProps) => {
  const [active, setActive] = useState<string | null>(null);
  const [tone, setTone] = useState<"light" | "dark">("light");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const sections = [...document.querySelectorAll<HTMLElement>("main section[data-tone]")];
      const current = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= HEADER_HEIGHT && rect.bottom > HEADER_HEIGHT;
      });
      setTone(current?.dataset.tone === "dark" ? "dark" : "light");
      setActive(current?.id ?? null);
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll(); // first measurement on the next frame
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const dark = tone === "dark";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 backdrop-blur-md transition-colors duration-300",
        scrolled && (dark ? "bg-neutral-950/75" : "bg-stone-50/80"),
        dark ? "text-white" : "text-neutral-900",
      )}
    >
      <div className="mx-auto flex h-24 w-full max-w-6xl items-center gap-6 px-6 md:px-10">
        <a
          href={`${base}#top`}
          className="flex shrink-0 items-center gap-3 rounded-full focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
        >
          <span className="relative">
            {avatarPublicId ? (
              <CloudImage
                publicId={avatarPublicId}
                alt=""
                width={188}
                height={188}
                className="size-12 rounded-full object-cover md:size-13"
                priority
              />
            ) : (
              <span className="flex size-12 items-center justify-center rounded-full bg-neutral-300 text-lg font-semibold text-neutral-900 md:size-13">
                {name.charAt(0)}
              </span>
            )}
            {available && (
              <span
                className={cn(
                  "absolute right-0 bottom-0 size-3.5 rounded-full bg-emerald-500 ring-2",
                  dark ? "ring-neutral-950" : "ring-stone-50",
                )}
                aria-label="Available for new projects"
              />
            )}
          </span>
          <span className="hidden text-base font-semibold tracking-[0.2em] uppercase sm:block">
            {name}
          </span>
        </a>

        <span
          aria-hidden
          className={cn("hidden h-px flex-1 lg:block", dark ? "bg-white/20" : "bg-neutral-900/15")}
        />

        <nav aria-label="Sections" className="ml-auto hidden items-center gap-1 md:flex lg:ml-0">
          {links.map((link) => (
            <a
              key={link.id}
              href={`${base}#${link.id}`}
              aria-current={active === link.id ? "true" : undefined}
              className={cn(
                "relative rounded-md px-3 py-2 text-base transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none",
                active === link.id ? "opacity-100" : "opacity-75",
              )}
            >
              {link.label}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-3 bottom-1 h-px origin-left bg-current transition-transform duration-300",
                  active === link.id ? "scale-x-100" : "scale-x-0",
                )}
              />
            </a>
          ))}
        </nav>

        <ContactButton
          className={cn(
            // Phones get the menu button instead (MobileMenu).
            "hidden rounded-full border px-6 py-3 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none md:inline-block",
            dark
              ? "border-white/30 hover:bg-white hover:text-neutral-950"
              : "border-neutral-900/20 hover:bg-neutral-900 hover:text-white",
          )}
        />

        <MobileMenu name={name} links={links} whatsapp={whatsapp} active={active} base={base} />
      </div>
    </header>
  );
};
