"use client";

import { forwardRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useTheme } from "next-themes";
import { clientEnv } from "@/shared/configs/clientEnv";

type TurnstileFieldProps = {
  onToken: (token: string) => void;
};

// Cloudflare Turnstile bot check for public forms. Call ref.current?.reset()
// after each submit — a token can only be verified once.
export const TurnstileField = forwardRef<TurnstileInstance | undefined, TurnstileFieldProps>(
  function TurnstileField({ onToken }, ref) {
    const { resolvedTheme } = useTheme();
    return (
      <Turnstile
        ref={ref}
        siteKey={clientEnv.turnstileSiteKey}
        onSuccess={onToken}
        onExpire={() => onToken("")}
        onError={() => onToken("")}
        options={{ theme: resolvedTheme === "dark" ? "dark" : "light", size: "flexible" }}
      />
    );
  },
);
