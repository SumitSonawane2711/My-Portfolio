import type { Metadata } from "next";
import "../globals.css";
import { inter } from "@/shared/configs/fonts";
import { clientEnv } from "@/shared/configs/clientEnv";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { NavigationProgress } from "@/shared/components/NavigationProgress";
import { AppProviders } from "@/shared/components/providers";
import { cldUrl } from "@/shared/libs/cloudinaryUrl";
import { LiveVisitorBeacon } from "@/features/analytics/components/LiveVisitorBeacon";
import { getSettings } from "@/features/settings/queries/settingsQueries";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(clientEnv.siteUrl),
    title: settings.siteTitle,
    description: settings.siteDescription,
    alternates: { types: { "application/rss+xml": "/rss.xml" } },
    openGraph: {
      title: settings.siteTitle,
      description: settings.siteDescription,
      siteName: settings.name,
      images: settings.ogImagePublicId
        ? [cldUrl(settings.ogImagePublicId, { width: 1200, height: 630, crop: "fill" })]
        : undefined,
    },
  };
}

// Root layout of the public site. The dashboard has its own root layout in
// app/(admin) so its shadcn theme can't leak into the site (see local-docs guide, Part 6).
export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} bg-neutral-100 font-sans text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100`}
      >
        <AppProviders>
          <NavigationProgress />
          <LiveVisitorBeacon site="PORTFOLIO" />
          <Navbar name={settings.name} avatarPublicId={settings.avatarPublicId} />
          {children}
          <Footer name={settings.name} socials={settings.socials} />
        </AppProviders>
      </body>
    </html>
  );
}
