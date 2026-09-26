import {
  Briefcase,
  Cpu,
  FileText,
  FolderKanban,
  Images,
  Inbox,
  LayoutDashboard,
  MessageSquareQuote,
  Newspaper,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Shows the unread inbox count next to it. */
  badge?: "inbox";
};

export const ADMIN_NAV: AdminNavItem[] = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Projects", href: "/admin/projects", icon: FolderKanban },
  { title: "Blog", href: "/admin/blog", icon: Newspaper },
  { title: "Experience", href: "/admin/experience", icon: Briefcase },
  { title: "Technologies", href: "/admin/technologies", icon: Cpu },
  { title: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { title: "Resumes", href: "/admin/resumes", icon: FileText },
  { title: "Inbox", href: "/admin/inbox", icon: Inbox, badge: "inbox" },
  { title: "Media", href: "/admin/media", icon: Images },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];
