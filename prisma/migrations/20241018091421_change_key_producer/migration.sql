/*
  Warnings:

  - You are about to drop the column `WarehouseId` on the `producers` table. All the data in the column will be lost.
  - Added the required column `CompanyId` to the `producers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "producers" DROP CONSTRAINT "producers_WarehouseId_fkey";

-- AlterTable
ALTER TABLE "producers" DROP COLUMN "WarehouseId",
ADD COLUMN     "CompanyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "producers" ADD CONSTRAINT "producers_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;
