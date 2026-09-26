import "server-only";
import type { MessageKind, MessageStatus } from "@/generated/prisma/client";
import { messageRepository } from "../repositories/messageRepository";

export type InboxMessage = Awaited<ReturnType<typeof messageRepository.list>>[number];

const STATUSES: MessageStatus[] = ["UNREAD", "READ", "ARCHIVED"];
const KINDS: MessageKind[] = ["CONTACT", "SUGGESTION", "CORRECTION", "THOUGHT"];

export function getInboxMessages(status?: string, kind?: string) {
  return messageRepository.list({
    status: STATUSES.includes(status as MessageStatus) ? (status as MessageStatus) : "UNREAD",
    kind: KINDS.includes(kind as MessageKind) ? (kind as MessageKind) : undefined,
  });
}
