"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconBrandWhatsapp, IconMail, IconX } from "@tabler/icons-react";
import { ContactForm } from "@/features/contact/components/ContactForm";
import { cn } from "@/shared/libs/utils";
import { whatsappHref } from "./contactActions";

export const OPEN_EVENT = "open-contact";

/** Any "Contact now" button on the page opens the one dialog below. */
export const ContactButton = ({
  children = "Contact now",
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <button
    type="button"
    onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
    className={className}
  >
    {children}
  </button>
);

type ContactDialogProps = {
  /** Digits with country code; the WhatsApp button only shows when set. */
  whatsapp: string | null;
  email: string | null;
};

// The contact popup: WhatsApp and email shortcuts plus the contact form. A
// fixed overlay (not a native modal <dialog>) so success/error toasts stay on top.
export const ContactDialog = ({ whatsapp, email }: ContactDialogProps) => {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  // Esc closes; page scroll is locked; focus moves in and back out.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="contact-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-neutral-950/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-dialog-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(event) => event.stopPropagation()}
            className="relative my-auto w-full max-w-lg rounded-3xl bg-white p-6 text-neutral-900 shadow-2xl md:p-8"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full text-neutral-500 transition hover:rotate-90 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none motion-reduce:hover:rotate-0"
            >
              <IconX className="size-5" />
            </button>

            <h2 id="contact-dialog-title" className="pr-10 text-2xl font-bold tracking-tight">
              Let&apos;s talk about your project
            </h2>
            <p className="mt-2 text-neutral-600">
              Message me on WhatsApp for a quick chat, or send the details below.
            </p>

            {(whatsapp || email) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {whatsapp && (
                  <a
                    href={whatsappHref(whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:hover:translate-y-0"
                  >
                    <IconBrandWhatsapp aria-hidden className="size-5" />
                    Chat on WhatsApp
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-full border border-neutral-900/15 px-5 py-3 text-sm font-semibold transition-colors hover:border-neutral-900/40 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none",
                      !whatsapp && "flex-1",
                    )}
                  >
                    <IconMail aria-hidden className="size-4" />
                    Email
                  </a>
                )}
              </div>
            )}

            {(whatsapp || email) && (
              <p className="my-6 flex items-center gap-3 text-xs font-medium tracking-wide text-neutral-400 uppercase before:h-px before:flex-1 before:bg-neutral-200 after:h-px after:flex-1 after:bg-neutral-200">
                or send a message
              </p>
            )}

            <ContactForm
              source="FREELANCE"
              onSent={close}
              className={cn(
                "max-w-none border-0 p-0 shadow-none",
                whatsapp || email ? "mt-0" : "mt-6",
              )}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
