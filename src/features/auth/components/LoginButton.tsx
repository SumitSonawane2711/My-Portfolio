"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { IconBrandGithub } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { authClient } from "@/shared/libs/authClient";

// Only accept in-dashboard return paths — anything else would be an open redirect.
const safeNext = (next?: string) =>
  next?.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";

export const LoginButton = ({ next }: { next?: string }) => {
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "github",
      callbackURL: safeNext(next),
      errorCallbackURL: "/login?error=access_denied",
    });
    // On success the browser is already navigating to GitHub.
    if (error) {
      setLoading(false);
      toast.error(error.message ?? "Could not start sign-in.");
    }
  };

  return (
    <Button onClick={signIn} disabled={loading} size="lg" className="w-full">
      {loading ? <Loader2 className="animate-spin" /> : <IconBrandGithub />}
      Continue with GitHub
    </Button>
  );
};
