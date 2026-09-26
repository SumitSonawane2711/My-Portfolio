"use client";

import { useEffect, useRef, useState } from "react";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { IconX } from "@tabler/icons-react";
import { toast } from "sonner";
import { TurnstileField } from "@/shared/components/TurnstileField";
import { submitFeedback } from "../actions/messageActions";
import { FEEDBACK_KINDS } from "../schemas/messageSchema";

type Kind = (typeof FEEDBACK_KINDS)[number];

const KIND_LABELS: Record<Kind, string> = {
  SUGGESTION: "Suggestion",
  CORRECTION: "Correction",
  THOUGHT: "Thought",
};

const inputClass =
  "rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-900 shadow focus:ring-2 focus:ring-primary focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100";

type FeedbackDialogProps = {
  open: boolean;
  onClose: () => void;
  postSlug: string;
  initialKind?: Kind;
  quotedText?: string;
};

// Private reader feedback — goes straight to the dashboard inbox, never shown publicly.
// A native <dialog> styled like the rest of the public site.
export const FeedbackDialog = ({
  open,
  onClose,
  postSlug,
  initialKind = "SUGGESTION",
  quotedText = "",
}: FeedbackDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined);
  const [kind, setKind] = useState<Kind>(initialKind);
  const [form, setForm] = useState({ message: "", name: "", email: "", website: "" });
  const [token, setToken] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return void toast.error("Please complete the verification first");
    setSending(true);
    try {
      const result = await submitFeedback({
        postSlug,
        kind,
        quotedText,
        message: form.message,
        name: form.name,
        email: form.email,
        website: form.website,
        turnstileToken: token,
      });
      if (!result.ok) {
        toast.error(Object.values(result.fieldErrors ?? {}).flat()[0] ?? result.error);
        return;
      }
      toast.success("Thanks! Your note went straight to the author.");
      setForm({ message: "", name: "", email: "", website: "" });
      onClose();
    } finally {
      turnstileRef.current?.reset();
      setToken("");
      setSending(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="feedback-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-neutral-200 bg-white p-0 text-neutral-900 shadow-xl backdrop:bg-black/40 backdrop:backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
    >
      <form onSubmit={send} className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <h2 id="feedback-title" className="font-semibold text-primary">
            Send private feedback
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-secondary">
          Only the author sees this. Email is optional and only used to reply.
        </p>

        <div className="flex gap-1" role="radiogroup" aria-label="Type">
          {FEEDBACK_KINDS.map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={kind === k}
              onClick={() => setKind(k)}
              className={`rounded-full border px-3 py-1 text-xs ${
                kind === k
                  ? "border-primary bg-primary text-white dark:text-neutral-950"
                  : "border-neutral-200 text-secondary dark:border-neutral-700"
              }`}
            >
              {KIND_LABELS[k]}
            </button>
          ))}
        </div>

        {quotedText && (
          <blockquote className="border-l-2 border-neutral-300 pl-3 text-sm text-secondary italic dark:border-neutral-700">
            {quotedText}
          </blockquote>
        )}

        <textarea
          rows={4}
          required
          minLength={10}
          maxLength={2000}
          aria-label="Message"
          placeholder={kind === "CORRECTION" ? "What should it say instead?" : "Your message"}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            aria-label="Name (optional)"
            placeholder="Name (optional)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
          <input
            type="email"
            aria-label="Email (optional)"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
        </div>
        {/* Honeypot: hidden from people and screen readers; bots fill it in. */}
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
        {open && <TurnstileField ref={turnstileRef} onToken={setToken} />}
        <button
          type="submit"
          disabled={sending}
          className="rounded-md bg-primary px-4 py-2 text-sm text-white shadow-md transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-neutral-950 dark:hover:bg-neutral-300"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </dialog>
  );
};
