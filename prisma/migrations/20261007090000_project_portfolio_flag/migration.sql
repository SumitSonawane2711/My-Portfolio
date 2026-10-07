-- Choose per project whether it shows on the developer portfolio (it already
-- had a flag for /freelance). Existing projects keep showing there.

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "portfolio" BOOLEAN NOT NULL DEFAULT true;
