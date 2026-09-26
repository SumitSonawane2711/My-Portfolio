import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";
import { AdminThemeToggle } from "./AdminThemeToggle";
import { SignOutButton } from "./SignOutButton";

// Top bar of every dashboard page: breadcrumbs on the left, theme toggle on the
// right. On small screens it also carries "View site" and "Sign out", which the
// sidebar only shows from md up.
export const AdminTopbar = () => {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-8">
      <div className="min-w-0 overflow-x-auto">
        <AdminBreadcrumbs />
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button asChild variant="ghost" size="icon" className="md:hidden" aria-label="View site">
          <Link href="/" target="_blank">
            <ExternalLink />
          </Link>
        </Button>
        <AdminThemeToggle />
        <div className="md:hidden">
          <SignOutButton compact />
        </div>
      </div>
    </header>
  );
};
