import type { ReactNode } from "react";
import { NatureBackground } from "./NatureBackground";

// The contact section and the footer share one background: the painting from
// the hero, faded behind the contact content and clearing towards the bottom,
// where the footer sits on top of it.
export const ContactAndFooter = ({ children }: { children: ReactNode }) => (
  <div className="relative isolate bg-stone-50">
    <NatureBackground focus="bottom" />
    <div
      aria-hidden
      className="absolute inset-0 -z-10 bg-gradient-to-b from-stone-50 from-25% via-stone-100/60 via-55% to-stone-100/0 to-90%"
    />
    {children}
  </div>
);
