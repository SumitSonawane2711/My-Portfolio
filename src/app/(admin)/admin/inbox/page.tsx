import type { Metadata } from "next";
import { requireAdmin } from "@/shared/libs/authGuard";
import { InboxManager } from "@/features/inbox/components/InboxManager";
import { getInboxMessages } from "@/features/inbox/queries/messageQueries";

export const metadata: Metadata = { title: "Inbox" };

interface PageProps {
  searchParams: Promise<{ status?: string; kind?: string }>;
}

export default async function InboxPage({ searchParams }: PageProps) {
  await requireAdmin();
  const { status, kind } = await searchParams;
  return <InboxManager messages={await getInboxMessages(status, kind)} />;
}
