import { Inter, Manrope, Montserrat } from "next/font/google";

// Shared by both root layouts ((site) and (admin)) and global-not-found.
export const inter = Inter({
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  subsets: ["latin"],
});

// ChaiUI (DESIGN.md), portfolio and dashboard only: Manrope for everything,
// Montserrat for card titles, buttons on cards and the highlight phrase.
// The variables are --ff-* because --font-manrope / --font-montserrat are the
// Tailwind theme names that point at them (globals.css).
export const manrope = Manrope({
  variable: "--ff-manrope",
  subsets: ["latin"],
});

export const montserrat = Montserrat({
  variable: "--ff-montserrat",
  subsets: ["latin"],
});

/** Every font variable a ChaiUI layout needs on <body>. */
export const chaiFontVariables = `${inter.variable} ${manrope.variable} ${montserrat.variable}`;
