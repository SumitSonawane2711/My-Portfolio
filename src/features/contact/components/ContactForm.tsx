"use client";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { TurnstileField } from "@/shared/components/TurnstileField";
import { sendContactMessage } from "@/features/inbox/actions/messageActions";
import { cn } from "@/shared/libs/utils";

type ContactFormProps = {
  /** Shown in the inbox, so you know which site the message came from. */
  source?: "PORTFOLIO" | "FREELANCE";
  className?: string;
  /** Called after a successful send (e.g. to close a popup). */
  onSent?: () => void;
};

export const ContactForm = ({ source = "PORTFOLIO", className, onSent }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Bot protection: Turnstile token + a honeypot field real visitors never see.
  const [token, setToken] = useState("");
  const [website, setWebsite] = useState("");
  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, message } = formData;

    if (!name || !email || !message) {
      toast.error("Please fill all the fields");
      return;
    }

    setIsSubmitting(true);

    if (!token) {
      toast.error("Please complete the verification first");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await sendContactMessage({
        ...formData,
        source,
        website,
        turnstileToken: token,
      });
      if (!result.ok) {
        const firstFieldError = Object.values(result.fieldErrors ?? {}).flat()[0];
        toast.error(firstFieldError ?? result.error);
        return;
      }
      toast.success("Message sent successfully");
      onSent?.();
      setFormData({ name: "", email: "", message: "" });
    } finally {
      // A Turnstile token can only be verified once.
      turnstileRef.current?.reset();
      setToken("");
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "mx-auto mt-10 flex w-full max-w-lg flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-md dark:border-neutral-700 dark:bg-neutral-900",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium tracking-tight text-primary">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-900 shadow focus:ring-2 focus:ring-primary focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email" className="text-sm font-medium tracking-tight text-primary">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-900 shadow focus:ring-2 focus:ring-primary focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="message" className="text-sm font-medium tracking-tight text-primary">
          Message
        </label>
        <textarea
          rows={5}
          id="message"
          name="message"
          className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-900 shadow focus:ring-2 focus:ring-primary focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          placeholder="Enter your message"
          value={formData.message}
          onChange={handleChange}
          required
        />
        {/* Honeypot: hidden from people and screen readers; bots fill it in. */}
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
        <TurnstileField ref={turnstileRef} onToken={setToken} />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-primary px-4 py-2 text-white shadow-md transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-neutral-950 dark:hover:bg-neutral-300"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};
