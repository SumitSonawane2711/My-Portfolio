-- Optional looping screen recording for a project (shown on the /freelance Work card).

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "previewVideoId" TEXT;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_previewVideoId_fkey" FOREIGN KEY ("previewVideoId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
