-- Replaces the on-site blog with Medium posts (the portfolio links out to Medium).
-- Drops Post, Tag, PostLike and reader feedback (Message.kind/postId/quotedText).
-- Former post covers become unused MediaAssets; Admin → Media cleanup removes them.

-- CreateEnum
CREATE TYPE "MediumPostSource" AS ENUM ('RSS', 'MANUAL');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_coverId_fkey";

-- DropForeignKey
ALTER TABLE "PostLike" DROP CONSTRAINT "PostLike_postId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_postId_fkey";

-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_B_fkey";

-- DropIndex
DROP INDEX "Message_kind_createdAt_idx";

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "mediumSyncedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "kind",
DROP COLUMN "postId",
DROP COLUMN "quotedText";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "PostLike";

-- DropTable
DROP TABLE "_PostToTag";

-- DropEnum
DROP TYPE "PostStatus";

-- DropEnum
DROP TYPE "MessageKind";

-- CreateTable
CREATE TABLE "MediumPost" (
    "id" TEXT NOT NULL,
    "guid" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL DEFAULT '',
    "coverUrl" TEXT,
    "tags" TEXT[],
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "source" "MediumPostSource" NOT NULL DEFAULT 'RSS',
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediumPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediumPost_guid_key" ON "MediumPost"("guid");

-- CreateIndex
CREATE INDEX "MediumPost_hidden_publishedAt_idx" ON "MediumPost"("hidden", "publishedAt");

