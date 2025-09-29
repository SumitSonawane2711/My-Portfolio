import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Navbar } from "./components/navbar";
import { ViewTransitions } from 'next-view-transitions'
import { Footer } from "./components/navbar/footer";
import { Toaster } from "sonner"
import { ThemeProvider } from "next-themes"


const inter = Inter({
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Full Stack Developer Portfolio",
  description: "Personal portfolio showcasing full stack development work",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <ViewTransitions>
      <ThemeProvider attribute="class">
      <html lang="en">
        
          <body
            className={`${inter.variable} antialiased font-sans bg-neutral-400`}
          >
            <Toaster position="top-center" />
            <Navbar />
            {children}
            <Footer />
          </body>
        

      </html>
      </ThemeProvider>
    </ViewTransitions>
  );
}
