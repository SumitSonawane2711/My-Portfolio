"use client";

import {
  IconBrandLinkedin,
  IconBrandWhatsapp,
  IconBrandX,
  IconCheck,
  IconLink,
  IconShare,
} from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { useIsClient } from "@/shared/hooks/useIsClient";

type ShareButtonsProps = {
  title: string;
  url: string;
};

const iconButton =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-secondary transition-colors hover:bg-neutral-100 hover:text-primary dark:border-neutral-700 dark:hover:bg-neutral-800";

// Share row for a blog post: native share sheet (where supported), copy link,
// and direct links to X, LinkedIn and WhatsApp.
export const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const isClient = useIsClient();
  const [copied, setCopied] = useState(false);
  const canNativeShare = isClient && typeof navigator.share === "function";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // Cancelled by the user — nothing to do.
    }
  };

  const text = encodeURIComponent(title);
  const link = encodeURIComponent(url);
  const targets = [
    {
      label: "Share on X",
      icon: IconBrandX,
      href: `https://x.com/intent/post?text=${text}&url=${link}`,
    },
    {
      label: "Share on LinkedIn",
      icon: IconBrandLinkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${link}`,
    },
    {
      label: "Share on WhatsApp",
      icon: IconBrandWhatsapp,
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
  ];

  return (
    <div className="flex items-center gap-2" aria-label="Share this post" role="group">
      <span className="mr-1 text-sm text-secondary">Share</span>
      {canNativeShare && (
        <button
          type="button"
          onClick={nativeShare}
          aria-label="Share…"
          title="Share…"
          className={iconButton}
        >
          <IconShare className="h-4 w-4" />
        </button>
      )}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        title="Copy link"
        className={iconButton}
      >
        {copied ? (
          <IconCheck className="h-4 w-4 text-green-600" />
        ) : (
          <IconLink className="h-4 w-4" />
        )}
      </button>
      {targets.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={iconButton}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
};
