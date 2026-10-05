"use client";
import React, { useEffect, useState } from "react";
import { CloudImage } from "./CloudImage";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { ToggleButton } from "./ThemeToggle";
import { HamburgerButton } from "./HamburgerButton";
import { NAV_ITEMS } from "@/shared/constants/nav";
import { cn } from "@/shared/libs/utils";

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

type NavbarProps = {
  name: string;
  avatarPublicId: string | null;
};

export const Navbar = ({ name, avatarPublicId }: NavbarProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const { scrollY } = useScroll();

  const [scrolled, setScrolled] = useState<boolean>(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  const y = useTransform(scrollY, [0, 100], [0, 10]);
  const width = useTransform(scrollY, [0, 100], ["min(92%, 56rem)", "min(88%, 48rem)"]);

  // The avatar is a button (not a <Link>), so warm the home page ourselves.
  useEffect(() => {
    if (!isHome) router.prefetch("/");
  }, [isHome, router]);

  const handleProfileClick = () => {
    if (isHome) {
      window.dispatchEvent(new Event("open-profile"));
      return;
    }

    router.push("/");
  };

  return (
    <motion.nav
      style={{
        boxShadow: scrolled ? "var(--shadow-md) " : "none",
        y,
        width,
      }}
      transition={{
        duration: 0.3,
        ease: "linear",
      }}
      className="fixed inset-x-0 top-3 z-50 mx-auto rounded-3xl border border-neutral-200 bg-white text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
    >
      <div className="flex items-center justify-between px-3 py-2 md:px-4">
        <button
          type="button"
          onClick={handleProfileClick}
          aria-label={
            isHome ? (name ? `Open ${name}'s profile` : "Open profile") : "Go to homepage"
          }
          className="shrink-0 rounded-full transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none"
        >
          {avatarPublicId ? (
            <CloudImage
              className="h-10 w-10 rounded-full object-cover"
              publicId={avatarPublicId}
              height={188}
              width={188}
              alt="Profile avatar"
              priority
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold dark:bg-neutral-800">
              {name.charAt(0) || "?"}
            </span>
          )}
        </button>
        <div className="flex items-center gap-1 md:gap-2">
          {NAV_ITEMS.map((item, idx) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                className={cn(
                  "relative hidden rounded-md px-2.5 py-1 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none md:block",
                  active
                    ? "font-medium text-neutral-900 dark:text-white"
                    : "text-neutral-600 dark:text-neutral-300",
                )}
                href={item.href}
                key={item.href}
                aria-current={active ? "page" : undefined}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                {hovered === idx && (
                  <motion.span
                    layoutId="hovered-span"
                    className="absolute inset-0 h-full w-full rounded-md bg-neutral-200 dark:bg-neutral-800"
                  />
                )}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-neutral-900 dark:bg-white"
                  />
                )}
                <span className="relative z-10">{item.title}</span>
              </Link>
            );
          })}

          <ToggleButton />

          <div className="md:hidden">
            <HamburgerButton isOpen={mobileOpen} onClick={() => setMobileOpen((prev) => !prev)} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden md:hidden"
          >
            <div className="flex flex-col gap-1 border-t border-neutral-200 px-3 py-2 dark:border-neutral-800">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="rounded-md px-2 py-2 text-sm hover:bg-neutral-200 aria-[current=page]:bg-neutral-100 aria-[current=page]:font-medium dark:hover:bg-neutral-800 dark:aria-[current=page]:bg-neutral-800"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
