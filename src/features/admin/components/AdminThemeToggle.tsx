"use client";

import { ThemeSwitcher } from "@/shared/components/chai/ThemeSwitcher";

// Light/dark switch for the dashboard: the ChaiUI half-shaded circle. Uses the
// same next-themes setting as the public site, so the choice carries over.
export const AdminThemeToggle = () => <ThemeSwitcher />;
