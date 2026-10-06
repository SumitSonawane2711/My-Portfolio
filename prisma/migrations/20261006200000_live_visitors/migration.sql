-- Live visitor counts for the dashboard (heartbeats from open tabs).

-- CreateEnum
CREATE TYPE "VisitorSite" AS ENUM ('PORTFOLIO', 'FREELANCE');

-- CreateTable
CREATE TABLE "LiveVisitor" (
    "id" TEXT NOT NULL,
    "site" "VisitorSite" NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveVisitor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LiveVisitor_site_lastSeen_idx" ON "LiveVisitor"("site", "lastSeen");
