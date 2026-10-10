"use client";
import React, { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js/mobile";
import { TurnstileField } from "@/shared/components/TurnstileField";
import { CountrySelect } from "./CountrySelect";
import { sendContactMessage } from "@/features/inbox/actions/messageActions";
import { contactSchema, MESSAGE_MAX, MESSAGE_MIN } from "@/features/inbox/schemas/messageSchema";
import { cn } from "@/shared/libs/utils";

type ContactFormProps = {
  /** Shown in the inbox, so you know which site the message came from. */
  source?: "PORTFOLIO" | "FREELANCE";
  className?: string;
  /** Called after a successful send (e.g. to close a popup). */
  onSent?: () => void;
};

type Field = "name" | "email" | "phone" | "message";
type Errors = Partial<Record<Field, string>>;

const DEFAULT_COUNTRY: CountryCode = "IN";
const EMPTY = { name: "", email: "", phone: "", message: "" };

const noSubscribe = () => () => {};

// Every country with its calling code, named in English, India first. Country
// names come from the browser (Intl) and can differ slightly from the server's,
// so the server renders only the default and the browser fills in the rest.
const useCountries = () => {
  const inBrowser = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
  return useMemo(() => {
    const names = new Intl.DisplayNames(["en"], { type: "region" });
    const toOption = (code: CountryCode) => ({
      code,
      dial: getCountryCallingCode(code),
      name: names.of(code) ?? code,
    });
    if (!inBrowser) return [toOption(DEFAULT_COUNTRY)];
    return getCountries()
      .map(toOption)
      .sort((a, b) =>
        a.code === DEFAULT_COUNTRY
          ? -1
          : b.code === DEFAULT_COUNTRY
            ? 1
            : a.name.localeCompare(b.name),
      );
  }, [inBrowser]);
};

/** The number as stored: "+", the country code, then only the digits. */
const fullPhone = (country: CountryCode, number: string) => {
  const digits = number.replace(/\D/g, "");
  return digits ? `+${getCountryCallingCode(country)}${digits}` : "";
};

const inputClass =
  "w-full rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-900 shadow focus:ring-2 focus:ring-primary focus:outline-none aria-invalid:border-red-500 aria-invalid:focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100";
const labelClass = "text-sm font-medium tracking-tight text-primary";

export const ContactForm = ({ source = "PORTFOLIO", className, onSent }: ContactFormProps) => {
  const countries = useCountries();
  const [formData, setFormData] = useState(EMPTY);
  const [country, setCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Bot protection: Turnstile token + a honeypot field real visitors never see.
  const [token, setToken] = useState("");
  const [website, setWebsite] = useState("");
  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined);

  const values = (data = formData, code = country) => ({
    ...data,
    phone: fullPhone(code, data.phone),
  });

  /** The error for one field (null when it's fine), using the shared rules. */
  const check = (field: Field, data = formData, code = country) => {
    const result = contactSchema.shape[field].safeParse(values(data, code)[field]);
    return result.success ? undefined : result.error.issues[0]?.message;
  };

  // Errors appear when you leave a field, then update as you fix it.
  const validate = (field: Field, data = formData, code = country) =>
    setErrors((current) => ({ ...current, [field]: check(field, data, code) }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as Field;
    // The number field takes digits and spaces only.
    const value = field === "phone" ? e.target.value.replace(/[^\d ]/g, "") : e.target.value;
    const next = { ...formData, [field]: value };
    setFormData(next);
    if (errors[field]) validate(field, next);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const found: Errors = {};
    for (const field of ["name", "email", "phone", "message"] as const) {
      found[field] = check(field);
    }
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    if (!token) {
      toast.error("Please complete the verification first");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sendContactMessage({
        ...values(),
        source,
        website,
        turnstileToken: token,
      });
      if (!result.ok) {
        // Server-side problems (e.g. a throwaway email) show under the field.
        const serverErrors = Object.fromEntries(
          Object.entries(result.fieldErrors ?? {}).map(([field, messages]) => [
            field,
            messages?.[0],
          ]),
        );
        setErrors(serverErrors);
        toast.error(Object.values(serverErrors).find(Boolean) ?? result.error);
        return;
      }
      toast.success("Message sent successfully");
      onSent?.();
      setFormData(EMPTY);
      setErrors({});
    } finally {
      // A Turnstile token can only be verified once.
      turnstileRef.current?.reset();
      setToken("");
      setIsSubmitting(false);
    }
  };

  const fieldProps = (field: Field) => ({
    id: field,
    name: field,
    value: formData[field],
    onChange: handleChange,
    onBlur: () => validate(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  });

  const errorText = (field: Field) =>
    errors[field] && (
      <p id={`${field}-error`} className="-mt-1 text-xs text-red-600 dark:text-red-400">
        {errors[field]}
      </p>
    );

  const messageLength = formData.message.trim().length;

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={cn(
        "mx-auto mt-10 flex w-full max-w-lg flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-md dark:border-neutral-700 dark:bg-neutral-900",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className={labelClass}>
          Full name
        </label>
        <input
          {...fieldProps("name")}
          type="text"
          autoComplete="name"
          maxLength={80}
          className={inputClass}
          placeholder="Enter your full name"
        />
        {errorText("name")}

        <label htmlFor="email" className={labelClass}>
          Email Address
        </label>
        <input
          {...fieldProps("email")}
          type="email"
          autoComplete="email"
          maxLength={254}
          className={inputClass}
          placeholder="Enter your email address"
        />
        {errorText("email")}

        <label htmlFor="phone" className={labelClass}>
          Mobile number
        </label>
        <div className="flex gap-2">
          <CountrySelect
            options={countries}
            value={country}
            onChange={(code) => {
              setCountry(code);
              if (formData.phone) validate("phone", formData, code);
            }}
            className={cn(inputClass, "w-auto")}
          />
          <input
            {...fieldProps("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            maxLength={20}
            className={cn(inputClass, "min-w-0 flex-1")}
            placeholder={country === "IN" ? "98765 43210" : "Mobile number"}
          />
        </div>
        {errorText("phone")}

        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="message" className={labelClass}>
            Message
          </label>
          <span
            className={cn(
              "text-xs tabular-nums",
              messageLength > 0 && messageLength < MESSAGE_MIN
                ? "text-amber-600 dark:text-amber-400"
                : "text-neutral-400",
            )}
          >
            {messageLength < MESSAGE_MIN
              ? `${messageLength} / ${MESSAGE_MIN} min`
              : `${messageLength} / ${MESSAGE_MAX}`}
          </span>
        </div>
        <textarea
          {...fieldProps("message")}
          rows={5}
          maxLength={MESSAGE_MAX}
          className={inputClass}
          placeholder="Tell me a little about your project or question"
        />
        {errorText("message")}

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
