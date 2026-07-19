"use client";
import React from "react";
import Link from "next/link";
import { IconDownload } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type DownloadResumeProps = {
    fileUrl?: string;
    fileName?: string;
    label?: string;
    className?: string;
};

export const DownloadResume = ({
    fileUrl = "/Sumit_Resume_2026.pdf",
    fileName = "Sumit_Resume_2026.pdf",
    label = "Resume",
    className,
}: DownloadResumeProps) => {
    return (
        <Link
            href="/resume"
            className={cn(
                "inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800",
                className
            )}
        >
            <IconDownload className="h-4 w-4" />
            {label}
        </Link>
    );
};