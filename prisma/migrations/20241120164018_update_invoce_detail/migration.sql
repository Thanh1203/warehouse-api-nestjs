/*
  Warnings:

  - You are about to drop the column `UpdateAt` on the `invoice_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invoice_details" DROP COLUMN "UpdateAt";

-- AddForeignKey
ALTER TABLE "invoice_details" ADD CONSTRAINT "invoice_details_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "products"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
