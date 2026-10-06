import type { Metadata } from "next";
import { Toaster } from "sonner";
import "../globals.css";
import { inter } from "@/shared/configs/fonts";
import { clientEnv } from "@/shared/configs/clientEnv";

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.siteUrl),
};

// Root layout of the client-facing /freelance page: its own header and colours,
// no developer-site navbar or theme toggle (the page has fixed light and dark
// sections).
export default function FreelanceRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} bg-stone-50 font-sans text-neutral-900 antialiased`}>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
