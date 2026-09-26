import "server-only";
import { db } from "@/shared/libs/db";
import { visibleWhere } from "@/features/blog/repositories/blogRepository";

export const likeRepository = {
  findVisiblePostId(slug: string) {
    return db.post
      .findFirst({ where: { slug, ...visibleWhere() }, select: { id: true } })
      .then((p) => p?.id ?? null);
  },

  count(postId: string) {
    return db.postLike.count({ where: { postId } });
  },

  exists(postId: string, visitorHash: string) {
    return db.postLike
      .findUnique({ where: { postId_visitorHash: { postId, visitorHash } }, select: { id: true } })
      .then(Boolean);
  },

  /** Likes or unlikes; the unique (postId, visitorHash) index prevents doubles under races. */
  async toggle(postId: string, visitorHash: string) {
    const removed = await db.postLike.deleteMany({ where: { postId, visitorHash } });
    if (removed.count > 0) return false;
    try {
      await db.postLike.create({ data: { postId, visitorHash } });
    } catch (error) {
      // P2002: a concurrent request already created it — treat as liked.
      if ((error as { code?: string }).code !== "P2002") throw error;
    }
    return true;
  },
};
