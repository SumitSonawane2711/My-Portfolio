"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/libs/utils";
import { ADMIN_NAV } from "../constants/adminNav";
import { SignOutButton } from "./SignOutButton";

type SidebarProps = {
  unreadCount: number;
};

const isActive = (pathname: string, href: string) =>
  href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

export const Sidebar = ({ unreadCount }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside className="border-b bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-r md:border-b-0">
      <div className="hidden px-4 py-5 text-sm font-semibold md:block">Portfolio dashboard</div>

      {/* Horizontal scrolling bar on small screens, vertical list from md up. */}
      <nav className="no-scrollbar flex gap-1 overflow-x-auto p-2 md:flex-1 md:flex-col md:overflow-visible">
        {ADMIN_NAV.map(({ title, href, icon: Icon, badge }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-4" />
              {title}
              {badge === "inbox" && unreadCount > 0 && (
                <Badge className="ml-auto h-5 min-w-5 px-1.5">{unreadCount}</Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="hidden flex-col gap-1 border-t p-2 md:flex">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        >
          <ExternalLink className="size-4" />
          View site
        </Link>
        <SignOutButton />
      </div>
    </aside>
  );
};
