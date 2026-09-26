import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { inter } from "@/shared/configs/fonts";

export const metadata: Metadata = {
  title: "Page not found",
};

// URLs that match no route at all. With two root layouts ((site) and (admin))
// there is no single layout to render a 404 inside, so Next.js serves this
// standalone page (experimental.globalNotFound in next.config.ts).
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-neutral-100 font-sans text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100`}
      >
        <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-start justify-center gap-4 bg-white p-4 md:px-18 dark:bg-neutral-900">
          <h1 className="text-2xl font-bold tracking-tighter text-primary md:text-4xl">
            Page not found
          </h1>
          <p className="max-w-xl text-sm text-secondary">
            The page you are looking for doesn&apos;t exist or has moved.
          </p>
          <Link href="/" className="text-sm font-medium text-primary">
            Back home
          </Link>
        </main>
      </body>
    </html>
  );
}
