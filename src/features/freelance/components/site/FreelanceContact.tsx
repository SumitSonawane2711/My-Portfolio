import { IconArrowUpRight, IconBrandWhatsapp, IconMail, IconPhone } from "@tabler/icons-react";
import { RichText } from "@/shared/components/RichText";
import { ContactForm } from "@/features/contact/components/ContactForm";
import { callHref, whatsappHref, type ContactChannels } from "./contactActions";

type FreelanceContactProps = { title: string; intro: string; channels: ContactChannels };

export const FreelanceContact = ({ title, intro, channels }: FreelanceContactProps) => {
  const direct = [
    channels.phone && {
      href: callHref(channels.phone),
      label: "Call now",
      detail: channels.phone,
      Icon: IconPhone,
      external: false,
    },
    channels.whatsapp && {
      href: whatsappHref(channels.whatsapp),
      label: "Message on WhatsApp",
      detail: "Usually the fastest reply",
      Icon: IconBrandWhatsapp,
      external: true,
    },
    channels.email && {
      href: `mailto:${channels.email}`,
      label: "Send an email",
      detail: channels.email,
      Icon: IconMail,
      external: false,
    },
  ].filter((item): item is Exclude<typeof item, null | "" | undefined> => Boolean(item));

  return (
    <section
      id="contact"
      data-tone="light"
      aria-labelledby="contact-title"
      className="bg-stone-100 py-24 text-neutral-900 md:py-32"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-10">
        <div className="reveal">
          <h2 id="contact-title" className="text-3xl font-bold tracking-tight md:text-5xl">
            {title}
          </h2>
          {intro && (
            <RichText
              text={intro}
              className="mt-6 text-lg leading-relaxed text-neutral-600"
              boldClassName="text-neutral-900"
            />
          )}
          {direct.length > 0 && (
            <ul className="mt-10 flex flex-col gap-3">
              {direct.map(({ href, label, detail, Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                    className="group flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-neutral-900/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none motion-reduce:hover:translate-y-0"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{label}</span>
                      <span className="block truncate text-sm text-neutral-500">{detail}</span>
                    </span>
                    <IconArrowUpRight
                      aria-hidden
                      className="size-5 text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-900"
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="reveal">
          <ContactForm
            source="FREELANCE"
            className="mt-0 max-w-none rounded-3xl border-0 p-6 shadow-none ring-1 ring-neutral-900/5 md:p-8"
          />
        </div>
      </div>
    </section>
  );
};
