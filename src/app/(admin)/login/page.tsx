import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/shared/libs/authGuard";
import { LoginCard } from "@/features/auth/components/LoginCard";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  if (await getAdminSession()) redirect("/admin");

  const { error, next } = await searchParams;
  return <LoginCard error={error} next={next} />;
}
