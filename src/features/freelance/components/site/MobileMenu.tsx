"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IconArrowUpRight, IconBrandWhatsapp, IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "@/shared/libs/utils";
import { ContactButton, OPEN_EVENT } from "./ContactDialog";
import { contactPillClass, whatsappHref } from "./contactActions";
import type { HeaderLink } from "./FreelanceHeader";

type MobileMenuProps = {
  name: string;
  links: HeaderLink[];
  /** Digits with country code; the WhatsApp button only shows when set. */
  whatsapp: string | null;
  /** The section in view (its link is highlighted). */
  active: string | null;
};

const EASE = [0.22, 1, 0.36, 1] as const;
const noSubscribe = () => () => {};

// Phones only: a menu button in the header that opens a full-screen dark
// panel with the section links, "Contact now" and WhatsApp.
export const MobileMenu = ({ name, links, whatsapp, active }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  // The panel is rendered into <body>: inside the header, its backdrop blur
  // would make "fixed inset-0" cover only the header.
  const inBrowser = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );

  // Esc closes; page scroll is locked while open; focus returns to the button.
  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = overflow;
      toggle?.focus();
    };
  }, [open]);

  // "Contact now" (here or anywhere) opens the contact popup: close the menu.
  useEffect(() => {
    const onContact = () => setOpen(false);
    window.addEventListener(OPEN_EVENT, onContact);
    return () => window.removeEventListener(OPEN_EVENT, onContact);
  }, []);

  // Back to the normal header when the screen gets wide enough for it.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const onChange = () => wide.matches && setOpen(false);
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="ml-auto flex size-12 items-center justify-center rounded-full border border-current/20 transition-colors hover:border-current/50 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none md:hidden"
      >
        <IconMenu2 aria-hidden className="size-6" />
      </button>

      {inBrowser &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
                initial={{ opacity: 0, y: reduceMotion ? 0 : -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -16 }}
                transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE }}
                className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-neutral-950 px-6 pb-8 text-white md:hidden"
              >
                <div className="flex h-24 shrink-0 items-center justify-between">
                  <span className="text-base font-semibold tracking-[0.2em] uppercase">{name}</span>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close menu"
                    // Focused on open, so keyboard and screen reader users start here.
                    autoFocus
                    className="flex size-12 items-center justify-center rounded-full border border-white/20 transition hover:rotate-90 hover:border-white/50 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none motion-reduce:hover:rotate-0"
                  >
                    <IconX aria-hidden className="size-6" />
                  </button>
                </div>

                <nav aria-label="Sections" className="mt-6">
                  <ul className="flex flex-col border-t border-white/10">
                    {links.map((link, index) => (
                      <motion.li
                        key={link.id}
                        initial={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.35,
                          delay: reduceMotion ? 0 : 0.08 + index * 0.05,
                          ease: EASE,
                        }}
                        className="border-b border-white/10"
                      >
                        <a
                          href={`#${link.id}`}
                          onClick={close}
                          aria-current={active === link.id ? "true" : undefined}
                          className={cn(
                            "group flex items-center justify-between py-5 text-3xl font-semibold tracking-tight transition-colors focus-visible:text-amber-400 focus-visible:outline-none",
                            active === link.id ? "text-white" : "text-white/70 hover:text-white",
                          )}
                        >
                          {link.label}
                          <IconArrowUpRight
                            aria-hidden
                            className="size-6 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                          />
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                <motion.div
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : 0.3 }}
                  className="mt-auto flex flex-col gap-3 pt-10"
                >
                  <ContactButton
                    className={cn(contactPillClass("dark"), "justify-center py-4 text-base")}
                  >
                    Contact now
                  </ContactButton>
                  {whatsapp && (
                    <a
                      href={whatsappHref(whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={close}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:outline-none"
                    >
                      <IconBrandWhatsapp aria-hidden className="size-5" />
                      Chat on WhatsApp
                    </a>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};
