"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { authClient } from "@/shared/libs/authClient";

export const SignOutButton = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const signOut = () =>
    startTransition(async () => {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    });

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
