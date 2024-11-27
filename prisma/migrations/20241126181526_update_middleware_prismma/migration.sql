/*
  Warnings:

  - Added the required column `CompanyId` to the `stockTransfers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stockTransfers" ADD COLUMN     "CompanyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "stockTransfers" ADD CONSTRAINT "stockTransfers_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;
