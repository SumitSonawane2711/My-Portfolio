import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "../globals.css";
import { chaiFontVariables } from "@/shared/configs/fonts";
import { AppProviders } from "@/shared/components/providers";
import { NavigationProgress } from "@/shared/components/NavigationProgress";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Dashboard" },
  robots: { index: false, follow: false },
};

// Root layout of the dashboard and login page. `admin-theme` on <body> scopes
// the shadcn tokens (see globals.css) so they never reach the public site.
export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${chaiFontVariables} admin-theme font-sans antialiased`}>
        <AppProviders>
          <NavigationProgress />
          <NuqsAdapter>{children}</NuqsAdapter>
        </AppProviders>
      </body>
    </html>
  );
}
