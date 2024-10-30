/*
  Warnings:

  - Added the required column `CompanyId` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CompanyId` to the `classifies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "CompanyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "classifies" ADD COLUMN     "CompanyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classifies" ADD CONSTRAINT "classifies_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;
