import type { Metadata } from "next";
import "../globals.css";
import { inter } from "@/shared/configs/fonts";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { AppProviders } from "@/shared/components/providers";

export const metadata: Metadata = {
  title: "Full Stack Developer Portfolio",
  description: "Personal portfolio showcasing full stack development work",
};

// Root layout of the public site. The dashboard has its own root layout in
// app/(admin) so its shadcn theme can't leak into the site (see local-docs guide, Part 6).
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} bg-neutral-100 font-sans text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100`}
      >
        <AppProviders>
          <Navbar />
          {children}
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
