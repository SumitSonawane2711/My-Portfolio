import "server-only";
import { db } from "@/shared/libs/db";
import type { MessageStatus, Prisma } from "@/generated/prisma/client";

export const messageRepository = {
  create(data: Prisma.MessageUncheckedCreateInput) {
    return db.message.create({ data, select: { id: true } });
  },

  list({ status }: { status?: MessageStatus }) {
    return db.message.findMany({
      where: { ...(status && { status }) },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  },

  setStatus(id: string, status: MessageStatus) {
    return db.message.update({ where: { id }, data: { status } });
  },

  delete(id: string) {
    return db.message.delete({ where: { id } });
  },
};
