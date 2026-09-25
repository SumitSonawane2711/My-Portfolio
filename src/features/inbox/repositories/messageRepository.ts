import "server-only";
import { db } from "@/shared/libs/db";
import type { MessageKind, MessageStatus, Prisma } from "@/generated/prisma/client";
import { visibleWhere } from "@/features/blog/repositories/blogRepository";

export const messageRepository = {
  create(data: Prisma.MessageUncheckedCreateInput) {
    return db.message.create({ data, select: { id: true } });
  },

  findVisiblePost(slug: string) {
    return db.post.findFirst({
      where: { slug, ...visibleWhere() },
      select: { id: true, title: true },
    });
  },

  list({ status, kind }: { status?: MessageStatus; kind?: MessageKind }) {
    return db.message.findMany({
      where: { ...(status && { status }), ...(kind && { kind }) },
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { post: { select: { title: true, slug: true } } },
    });
  },

  setStatus(id: string, status: MessageStatus) {
    return db.message.update({ where: { id }, data: { status } });
  },

  delete(id: string) {
    return db.message.delete({ where: { id } });
  },
};
