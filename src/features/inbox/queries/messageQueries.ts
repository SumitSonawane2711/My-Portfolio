import "server-only";
import type { MessageStatus } from "@/generated/prisma/client";
import { messageRepository } from "../repositories/messageRepository";

export type InboxMessage = Awaited<ReturnType<typeof messageRepository.list>>[number];

const STATUSES: MessageStatus[] = ["UNREAD", "READ", "ARCHIVED"];

export function getInboxMessages(status?: string) {
  return messageRepository.list({
    status: STATUSES.includes(status as MessageStatus) ? (status as MessageStatus) : "UNREAD",
  });
}
