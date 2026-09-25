"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/shared/components/ui/button";
import { useIsClient } from "@/shared/hooks/useIsClient";

// Light/dark switch for the dashboard. Uses the same next-themes setting as the
// public site, so the choice carries over between them.
export const AdminThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsClient();

  // The theme is only known in the browser; render a same-size placeholder first.
  if (!mounted) return <span className="size-9" aria-hidden="true" />;

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
};
