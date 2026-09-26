import { Inter } from "next/font/google";

// Shared by both root layouts ((site) and (admin)) and global-not-found.
export const inter = Inter({
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  subsets: ["latin"],
});
