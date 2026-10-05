import type { Metadata } from "next";
import { requireAdmin } from "@/shared/libs/authGuard";
import { InboxManager } from "@/features/inbox/components/InboxManager";
import { getInboxMessages } from "@/features/inbox/queries/messageQueries";

export const metadata: Metadata = { title: "Inbox" };

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function InboxPage({ searchParams }: PageProps) {
  await requireAdmin();
  const { status } = await searchParams;
  return <InboxManager messages={await getInboxMessages(status)} />;
}
