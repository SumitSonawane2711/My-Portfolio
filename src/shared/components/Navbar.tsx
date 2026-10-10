"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { CloudImage } from "./CloudImage";
import { HamburgerButton } from "./HamburgerButton";
import { ThemeSwitcher } from "./chai/ThemeSwitcher";
import { NAV_ITEMS } from "@/shared/constants/nav";
import { cn } from "@/shared/libs/utils";

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

type NavbarProps = {
  name: string;
  avatarPublicId: string | null;
};

const navLink =
  "inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors duration-150 outline-none hover:bg-neutral-500/10 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-[current=page]:text-foreground";

// ChaiUI header: sticky and transparent; the blur arrives once the page has
// scrolled. Avatar and name on the left (the avatar opens the profile card on
// the home page), links, the theme switcher and (on phones) the menu on the right.
export const Navbar = ({ name, avatarPublicId }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      data-scrolled={scrolled || mobileOpen}
      className="sticky inset-x-0 top-0 z-50 bg-transparent transition-[backdrop-filter,background-color] duration-300 ease-in-out data-[scrolled=true]:bg-background/60 data-[scrolled=true]:backdrop-blur-md"
    >
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-5xl items-center justify-between gap-5 px-6 py-4 sm:px-10 sm:py-5"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleProfileClick}
            aria-label={
              isHome ? (name ? `Open ${name}'s profile` : "Open profile") : "Go to homepage"
            }
            className="shrink-0 rounded-full ring-1 ring-card-edge transition duration-200 hover:ring-card-edge-hover focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {avatarPublicId ? (
              <CloudImage
                className="size-9 rounded-full object-cover"
                publicId={avatarPublicId}
                height={188}
                width={188}
                alt="Profile avatar"
                priority
              />
            ) : (
              <span className="flex size-9 items-center justify-center rounded-full bg-neutral-500/15 text-sm font-semibold">
                {name.charAt(0) || "?"}
              </span>
            )}
          </button>
          <Link
            href="/"
            className="hidden text-[15px] font-semibold tracking-tight text-foreground transition-colors duration-200 hover:text-brand sm:block"
          >
            {name}
          </Link>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden items-center gap-0.5 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navLink}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
              >
                {item.title}
              </Link>
            ))}
          </div>
          <ThemeSwitcher />
          <div className="md:hidden">
            <HamburgerButton isOpen={mobileOpen} onClick={() => setMobileOpen((prev) => !prev)} />
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="border-t border-border px-6 py-3 md:hidden"
          >
            <ul className="flex flex-col">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className={cn(navLink, "h-11 w-full text-base")}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
