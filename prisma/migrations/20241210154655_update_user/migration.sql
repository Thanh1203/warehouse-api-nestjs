-- CreateEnum
CREATE TYPE "StatusUser" AS ENUM ('ACTIVE', 'DEACTIVE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "Status" "StatusUser" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "users_Phone_Email_idx" ON "users"("Phone", "Email");
