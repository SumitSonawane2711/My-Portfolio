import { IconBrandWhatsapp, IconMessage, IconPhone } from "@tabler/icons-react";
import { cn } from "@/shared/libs/utils";

export type ContactChannels = {
  phone: string | null;
  /** Digits with country code. */
  whatsapp: string | null;
  email: string | null;
};

const WHATSAPP_TEXT = "Hi Sumit, I'd like to talk about a project.";

export const callHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
export const whatsappHref = (number: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

type CtaButtonsProps = {
  channels: ContactChannels;
  tone?: "light" | "dark";
  className?: string;
};

const base =
  "group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-0 motion-reduce:hover:translate-y-0";

/**
 * "Call now" (when a phone number is set) and "Message now" (WhatsApp when a
 * number is set, otherwise the contact form below).
 */
export const CtaButtons = ({ channels, tone = "light", className }: CtaButtonsProps) => {
  const dark = tone === "dark";
  const message = channels.whatsapp
    ? { href: whatsappHref(channels.whatsapp), external: true, Icon: IconBrandWhatsapp }
    : { href: "#contact", external: false, Icon: IconMessage };

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {channels.phone && (
        <a
          href={callHref(channels.phone)}
          className={cn(
            base,
            "shadow-sm hover:shadow-lg",
            dark ? "bg-white text-neutral-950" : "bg-neutral-950 text-white",
          )}
        >
          <IconPhone
            aria-hidden
            className="size-4 transition-transform duration-300 group-hover:-rotate-12"
          />
          Call now
        </a>
      )}
      <a
        href={message.href}
        {...(message.external && { target: "_blank", rel: "noopener noreferrer" })}
        className={cn(
          base,
          channels.phone
            ? dark
              ? "border border-white/25 text-white hover:border-white/60"
              : "border border-neutral-900/20 text-neutral-900 hover:border-neutral-900/50"
            : dark
              ? "bg-white text-neutral-950"
              : "bg-neutral-950 text-white",
        )}
      >
        <message.Icon aria-hidden className="size-4" />
        Message now
      </a>
    </div>
  );
};
