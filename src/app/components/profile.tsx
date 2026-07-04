"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { IconMail, IconPhone, IconX } from "@tabler/icons-react";
import { DownloadResume } from "./download-resume";

export type SocialLink = {
    href: string;
    label: string;
    icon: React.ReactNode;
};

type ProfileProps = {
    imageSrc: string;
    name: string;
    role: string;
    experienceYears: number;
    summary: string;
    phone?: string;
    contactHref?: string;
    socialLinks?: SocialLink[];
};

export const Profile = ({
    imageSrc,
    name,
    role,
    experienceYears,
    summary,
    phone,
    contactHref = "/contact",
    socialLinks = [],
}: ProfileProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const isHome = pathname === "/";
    const [open, setOpen] = useState(false);

    // Esc to close + lock body scroll while the popup is open
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [open]);

    const handleClick = () => {
        if (isHome) {
            setOpen(true);
        } else {
            router.push("/");
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={handleClick}
                aria-label={isHome ? `Open ${name}'s profile` : "Go to homepage"}
                className="shrink-0 rounded-full transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
                <Image
                    className="h-10 w-10 rounded-full object-cover"
                    src={imageSrc}
                    height={188}
                    width={188}
                    alt={`${name} avatar`}
                    priority
                />
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            key="profile-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            key="profile-modal"
                            role="dialog"
                            aria-modal="true"
                            aria-label={`${name} profile card`}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="relative w-full max-w-sm rounded-3xl border border-neutral-200 bg-white p-6 text-neutral-800 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 sm:max-w-md sm:p-8"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    aria-label="Close profile"
                                    className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                                >
                                    <IconX className="h-4 w-4" />
                                </button>

                                <div className="flex flex-col items-center text-center">
                                    <Image
                                        src={imageSrc}
                                        height={140}
                                        width={140}
                                        alt={`${name} avatar`}
                                        className="h-28 w-28 rounded-full object-cover ring-4 ring-neutral-100 dark:ring-neutral-800 sm:h-32 sm:w-32"
                                    />

                                    <h2 className="mt-4 text-xl font-semibold sm:text-2xl">{name}</h2>

                                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                        {role} · {experienceYears}+ {experienceYears === 1 ? "year" : "years"} experience
                                    </p>

                                    <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                                        {summary}
                                    </p>
                                </div>

                                {socialLinks.length > 0 && (
                                    <div className="mt-6 flex items-center justify-center gap-2">
                                        {socialLinks.map((link) => (
                                            <a
                                                key={link.href}
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={link.label}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                                            >
                                                {link.icon}
                                            </a>
                                        ))}
<DownloadResume />

                                    </div>
                                )}
                                <div className="mt-6 flex items-center gap-2">
                                    <Link
                                        href={contactHref}
                                        onClick={() => setOpen(false)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-neutral-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
                                    >
                                        <IconMail className="h-4 w-4" />
                                        Get in touch
                                    </Link>

                                    {phone && (
                                        <a
                                            href={`tel:${phone}`}
                                            aria-label="Call"
                                            title={phone}
                                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                        >
                                            <IconPhone className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};