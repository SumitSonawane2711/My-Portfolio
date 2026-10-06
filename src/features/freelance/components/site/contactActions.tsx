import { cn } from "@/shared/libs/utils";

export type ContactChannels = {
  /** Digits with country code. */
  whatsapp: string | null;
  email: string | null;
};

const WHATSAPP_TEXT = "Hi Sumit, I'd like to talk about a project.";

export const whatsappHref = (number: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

/** The main "Contact now" pill (opens the contact popup; see ContactDialog). */
export const contactPillClass = (tone: "light" | "dark" = "light") =>
  cn(
    "group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-0 motion-reduce:hover:translate-y-0",
    tone === "dark" ? "bg-white text-neutral-950" : "bg-neutral-950 text-white",
  );
