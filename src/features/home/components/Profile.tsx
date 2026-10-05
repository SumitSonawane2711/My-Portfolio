"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { IconFileText, IconMail, IconMapPin, IconPhone, IconX } from "@tabler/icons-react";
import type { SiteProfile } from "@/features/settings/interfaces/settings";
import { CloudImage } from "@/shared/components/CloudImage";
import { SOCIAL_LABELS, SocialIcon, socialHref } from "@/shared/components/SocialIcon";

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
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
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
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-neutral-200 bg-white text-neutral-800 shadow-2xl sm:max-w-md dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
            >
              <div
                aria-hidden
                className="h-24 bg-gradient-to-br from-neutral-200 via-neutral-100 to-amber-100 dark:from-neutral-800 dark:via-neutral-900 dark:to-amber-500/20"
              />
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close profile"
                className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-full bg-white/80 text-neutral-600 backdrop-blur transition hover:rotate-90 hover:bg-white hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none motion-reduce:hover:rotate-0 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:bg-neutral-900"
              >
                <IconX className="size-4" />
              </button>

              <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                <div className="-mt-12 flex items-end justify-between">
                  {avatarPublicId ? (
                    <CloudImage
                      publicId={avatarPublicId}
                      // Same size as the navbar avatar → already cached, shows instantly.
                      height={188}
                      width={188}
                      alt={name}
                      className="size-24 rounded-full object-cover ring-4 ring-white dark:ring-neutral-900"
                    />
                  ) : (
                    <span className="flex size-24 items-center justify-center rounded-full bg-neutral-200 text-2xl font-semibold ring-4 ring-white dark:bg-neutral-800 dark:ring-neutral-900">
                      {name.charAt(0)}
                    </span>
                  )}
                  {profile.availableForWork && (
                    <span className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Open to work
                    </span>
                  )}
                </div>

                <h2 id="profile-name" className="mt-4 text-xl font-semibold tracking-tight">
                  {name}
                </h2>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
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
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {summary}
                  </p>
                )}

                {profile.socials.length > 0 && (
                  <ul className="mt-5 flex flex-wrap items-center gap-2">
                    {profile.socials.map((link) => (
                      <li key={link.url}>
                        <a
                          href={socialHref(link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={SOCIAL_LABELS[link.platform]}
                          title={SOCIAL_LABELS[link.platform]}
                          className="inline-flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition duration-200 hover:-translate-y-0.5 hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none motion-reduce:hover:translate-y-0 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
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
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
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
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <IconFileText className="size-4" />
                    </Link>
                  )}
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      aria-label={`Call ${phone}`}
                      title={phone}
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
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
