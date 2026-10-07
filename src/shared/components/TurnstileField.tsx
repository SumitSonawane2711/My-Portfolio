"use client";

import { forwardRef, useSyncExternalStore } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useTheme } from "next-themes";
import { clientEnv } from "@/shared/configs/clientEnv";

type TurnstileFieldProps = {
  onToken: (token: string) => void;
};

// The full-width widget needs at least 300px; narrower phones get the compact
// (150px) one so the form never pushes the page wider than the screen.
const NARROW = "(max-width: 400px)";
const subscribeNarrow = (onChange: () => void) => {
  const query = window.matchMedia(NARROW);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

// Cloudflare Turnstile bot check for public forms. Call ref.current?.reset()
// after each submit — a token can only be verified once.
export const TurnstileField = forwardRef<TurnstileInstance | undefined, TurnstileFieldProps>(
  function TurnstileField({ onToken }, ref) {
    const { resolvedTheme } = useTheme();
    const narrow = useSyncExternalStore(
      subscribeNarrow,
      () => window.matchMedia(NARROW).matches,
      () => false,
    );
    const size = narrow ? "compact" : "flexible";
    return (
      <Turnstile
        // The size is fixed once the widget loads: remount it when it changes.
        key={size}
        ref={ref}
        siteKey={clientEnv.turnstileSiteKey}
        onSuccess={onToken}
        onExpire={() => onToken("")}
        onError={() => onToken("")}
        options={{ theme: resolvedTheme === "dark" ? "dark" : "light", size }}
      />
    );
  },
);
