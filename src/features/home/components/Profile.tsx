"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { IconFileText, IconMail, IconMapPin, IconPhone, IconX } from "@tabler/icons-react";
import type { SiteProfile } from "@/features/settings/interfaces/settings";
import { CloudImage } from "@/shared/components/CloudImage";
import { SOCIAL_LABELS, SocialIcon, socialHref } from "@/shared/components/SocialIcon";
import { chaiButtonVariants } from "@/shared/components/chai/Button";
import { cn } from "@/shared/libs/utils";

export type ProfileCardData = Pick<
  SiteProfile,
  | "name"
  | "yearsOfExperience"
  | "summary"
  | "phone"
  | "socials"
  | "avatarPublicId"
  | "location"
  | "availableForWork"
>;

// Profile card, opened from the navbar avatar ("open-profile" event).
export const Profile = ({
  profile,
  hasResume,
}: {
  profile: ProfileCardData;
  hasResume: boolean;
}) => {
  const { name, yearsOfExperience: years, summary, phone, avatarPublicId, location } = profile;
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onOpenProfile = () => setOpen(true);
    window.addEventListener("open-profile", onOpenProfile);
    return () => window.removeEventListener("open-profile", onOpenProfile);
  }, []);

  // Esc closes; body scroll is locked; focus moves into the card and returns after.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="profile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            key="profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-name"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            onClick={close}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+4px)] border border-card-edge bg-background text-foreground sm:max-w-md"
            >
              <div
                aria-hidden
                className="h-24 bg-[url(/chaiui/background.svg)] bg-[length:1400px] bg-top hue-rotate-180 invert dark:hue-rotate-0 dark:invert-0"
              />
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close profile"
                className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-md bg-background/70 text-foreground backdrop-blur transition hover:text-brand focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <IconX className="size-4" />
              </button>

              <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                <div className="relative -mt-12 flex items-end justify-between">
                  {avatarPublicId ? (
                    <CloudImage
                      publicId={avatarPublicId}
                      // Same size as the navbar avatar → already cached, shows instantly.
                      height={188}
                      width={188}
                      alt={name}
                      className="size-24 rounded-full object-cover ring-4 ring-background"
                    />
                  ) : (
                    <span className="flex size-24 items-center justify-center rounded-full bg-neutral-500/15 text-2xl font-semibold ring-4 ring-background">
                      {name.charAt(0)}
                    </span>
                  )}
                  {profile.availableForWork && (
                    <span className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-card-edge px-2.5 py-1 text-xs text-foreground">
                      <span className="size-1.5 rounded-full bg-green-500" />
                      Open to work
                    </span>
                  )}
                </div>

                <h2 id="profile-name" className="mt-4 text-xl font-semibold tracking-tight">
                  {name}
                </h2>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span>
                    {years}+ {years === 1 ? "year" : "years"} experience
                  </span>
                  {location && (
                    <span className="inline-flex items-center gap-1">
                      <IconMapPin aria-hidden className="size-3.5" />
                      {location}
                    </span>
                  )}
                </p>
                {summary && (
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {summary}
                  </p>
                )}

                {profile.socials.length > 0 && (
                  <ul className="mt-4 flex flex-wrap items-center gap-1">
                    {profile.socials.map((link) => (
                      <li key={link.url}>
                        <a
                          href={socialHref(link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={SOCIAL_LABELS[link.platform]}
                          title={SOCIAL_LABELS[link.platform]}
                          className={chaiButtonVariants({ variant: "ghost", size: "icon" })}
                        >
                          <SocialIcon platform={link.platform} className="size-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-6 flex items-center gap-2">
                  <Link
                    href="/contact"
                    onClick={close}
                    className={cn(chaiButtonVariants({ variant: "solid", size: "lg" }), "flex-1")}
                  >
                    <IconMail className="size-4" />
                    Get in touch
                  </Link>
                  {hasResume && (
                    <Link
                      href="/resume"
                      onClick={close}
                      aria-label="Resume"
                      title="Resume"
                      className={cn(
                        chaiButtonVariants({ variant: "outline", size: "icon" }),
                        "size-10",
                      )}
                    >
                      <IconFileText className="size-4" />
                    </Link>
                  )}
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      aria-label={`Call ${phone}`}
                      title={phone}
                      className={cn(
                        chaiButtonVariants({ variant: "outline", size: "icon" }),
                        "size-10",
                      )}
                    >
                      <IconPhone className="size-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
