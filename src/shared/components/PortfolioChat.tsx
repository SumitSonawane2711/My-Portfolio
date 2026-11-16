"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Bot, BotMessageSquareIcon, LoaderCircle, Send, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };
type Audience = "portfolio" | "freelance";

// Hide an unfinished Markdown link while text is still streaming
function hidePartialLink(content: string) {
  return content.replace(/\[[^\]]*$|\[[^\]]*\]\([^)]*$/, "");
}

function renderLinks(content: string, isFreelance: boolean): ReactNode[] {
  const linkPattern =
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*|#[^\s)]*)\)|(\/(?:freelance\/work|professional-experience|projects(?:\/[\w-]+)?|freelance|contact|about|resume|blog)(?:#[\w-]+)?)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(content))) {
    if (match.index > lastIndex) parts.push(content.slice(lastIndex, match.index));
    const [, linkedLabel, linkedHref, barePath] = match;
    const href = linkedHref ?? barePath ?? match[0];
    const route = href;
    const label =
      linkedLabel ??
      (route === "/contact" || route.endsWith("#contact")
        ? "Contact page"
        : route === "/projects"
          ? "Projects page"
          : route.startsWith("/projects/")
            ? "Project details"
            : route === "/freelance/work"
              ? "All freelance work"
              : route.includes("#")
                ? `${route.split("#")[1]} section`
                : `${route.slice(1)} page`);
    const external = href.startsWith("http://") || href.startsWith("https://");
    parts.push(
      <a
        key={`${match.index}-${href}`}
        href={href}
        className={`font-medium underline underline-offset-2 focus-visible:rounded-sm focus-visible:outline-2 ${
          isFreelance
            ? "text-amber-700 decoration-amber-700/50 hover:decoration-amber-700 focus-visible:outline-amber-700"
            : "text-brand decoration-brand/50 hover:decoration-brand focus-visible:outline-ring"
        }`}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {label}
      </a>,
    );
    lastIndex = linkPattern.lastIndex;
  }

  if (lastIndex < content.length) parts.push(content.slice(lastIndex));
  return parts;
}

export function PortfolioChat({ audience = "portfolio" }: { audience?: Audience }) {
  const isFreelance = audience === "freelance";
  const welcome: Message = {
    role: "assistant",
    content: isFreelance
      ? "Hi! I’m Sumit’s freelance assistant. Ask me about services, project work, or getting a quote."
      : "Hi! I’m Sumit’s portfolio assistant. Ask me about his work, projects, or skills.",
  };
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [welcome]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const [website, setWebsite] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: busy ? "auto" : "smooth" });
  }, [messages, error, busy, open]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || busy) return;

    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setDraft("");
    setError("");
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audience, website, messages: nextMessages.slice(-10) }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error ?? "Please try again.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let text = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setMessages((current) => {
          const copy = [...current];
          copy[copy.length - 1] = { role: "assistant", content: text };
          return copy;
        });
      }

      if (!text.trim()) {
        throw new Error("I couldn’t answer just now. Please try again in a moment.");
      }
    } catch (caught) {
      setMessages((current) =>
        current.at(-1)?.role === "assistant" && !current.at(-1)?.content
          ? current.slice(0, -1)
          : current,
      );
      if ((caught as Error).name === "AbortError") return;
      setError(
        caught instanceof Error ? caught.message : "I couldn’t answer just now. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={`fixed z-50 ${
        isFreelance
          ? "right-4 bottom-22 md:right-8 md:bottom-22"
          : "right-4 bottom-4 sm:right-6 sm:bottom-6"
      }`}
    >
      {open && (
        <section
          aria-label={`Chat with Sumit's ${isFreelance ? "freelance" : "portfolio"} assistant`}
          className={`mb-3 flex h-[min(70vh,36rem)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border shadow-2xl ${
            isFreelance
              ? "border-neutral-200 bg-white text-neutral-900"
              : "border-card-edge bg-background text-foreground"
          }`}
        >
          <header
            className={`flex items-center justify-between border-b px-4 py-3 ${
              isFreelance ? "border-neutral-200" : "border-border"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`grid size-9 place-items-center rounded-full ${
                  isFreelance ? "bg-amber-100 text-amber-800" : "bg-brand/15 text-brand"
                }`}
              >
                <Bot aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold">
                  {isFreelance ? "Freelance assistant" : "Portfolio assistant"}
                </h2>
                <p className="text-xs text-muted-foreground">Ask</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className={`rounded-lg p-2 transition focus-visible:outline-2 ${
                isFreelance
                  ? "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-amber-700"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-ring"
              }`}
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </header>

          <div aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => {
              if (message.role === "assistant" && !message.content) return null;
              const isLast = index === messages.length - 1;
              return (
                <div
                  key={`${index}-${message.role}`}
                  className={`max-w-[88%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    message.role === "user"
                      ? `ml-auto rounded-br-sm ${isFreelance ? "bg-neutral-900 text-white" : "bg-brand text-white"}`
                      : `rounded-bl-sm ${isFreelance ? "bg-neutral-100 text-neutral-900" : "bg-muted text-foreground"}`
                  }`}
                >
                  {renderLinks(
                    busy && isLast ? hidePartialLink(message.content) : message.content,
                    isFreelance,
                  )}
                </div>
              );
            })}
            {busy && messages.at(-1)?.content === "" && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground" role="status">
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                Thinking…
              </div>
            )}
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className={`flex items-end gap-2 border-t p-3 ${
              isFreelance ? "border-neutral-200" : "border-border"
            }`}
          >
            <label className="sr-only" htmlFor={`${audience}-chat-message`}>
              Your message
            </label>
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              className="absolute left-[-9999px] size-0 opacity-0"
            />
            <textarea
              id={`${audience}-chat-message`}
              value={draft}
              onChange={(event) => setDraft(event.target.value.slice(0, 500))}
              maxLength={500}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Ask a question…"
              rows={1}
              className={`max-h-28 min-h-10 flex-1 resize-y rounded-xl border px-3 py-2.5 text-sm outline-none focus-visible:ring-2 ${
                isFreelance
                  ? "border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-amber-700"
                  : "border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring"
              }`}
            />
            <button
              type="submit"
              disabled={busy || !draft.trim()}
              aria-label="Send message"
              className={`grid size-10 shrink-0 place-items-center rounded-xl text-white transition focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                isFreelance
                  ? "bg-neutral-950 ring-1 ring-white/20 hover:bg-neutral-900 focus-visible:outline-amber-700"
                  : "bg-brand hover:brightness-95 focus-visible:outline-ring"
              }`}
            >
              <Send aria-hidden="true" className="size-4" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={
          open
            ? `Close ${isFreelance ? "freelance" : "portfolio"} chat`
            : `Chat with Sumit's ${isFreelance ? "freelance" : "portfolio"} assistant`
        }
        className={`ml-auto flex h-12 cursor-pointer items-center gap-2 rounded-full px-4 font-semibold text-white shadow-lg transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
          isFreelance
            ? "border-1 border-white bg-black hover:bg-neutral-800"
            : "bg-brand hover:brightness-95 focus-visible:outline-ring"
        }`}
      >
        {open ? (
          <X aria-hidden="true" className="size-5" />
        ) : (
          <BotMessageSquareIcon aria-hidden="true" className="size-5" />
        )}
      </button>
    </div>
  );
}
