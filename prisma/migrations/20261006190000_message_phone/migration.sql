-- Mobile number on contact messages (international format).

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "phone" TEXT;
