"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { authClient } from "@/shared/libs/authClient";

/** `compact` renders an icon-only button (mobile top bar). */
export const SignOutButton = ({ compact = false }: { compact?: boolean }) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const signOut = () =>
    startTransition(async () => {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    });

  if (compact) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={signOut}
        disabled={pending}
        aria-label="Sign out"
      >
        <LogOut />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={signOut}
      disabled={pending}
      className="justify-start"
    >
      <LogOut />
      Sign out
    </Button>
  );
};
