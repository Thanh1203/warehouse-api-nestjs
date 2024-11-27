/*
  Warnings:

  - The primary key for the `purchase_return_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CreateAt` on the `purchase_return_details` table. All the data in the column will be lost.
  - You are about to drop the column `Id` on the `purchase_return_details` table. All the data in the column will be lost.
  - You are about to drop the column `UpdateAt` on the `purchase_return_details` table. All the data in the column will be lost.
  - The primary key for the `stockTransfers_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `stockTransfers_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "purchase_return_details" DROP CONSTRAINT "purchase_return_details_pkey",
DROP COLUMN "CreateAt",
DROP COLUMN "Id",
DROP COLUMN "UpdateAt",
ADD CONSTRAINT "purchase_return_details_pkey" PRIMARY KEY ("PurchaseOrderId", "ProductId");

-- AlterTable
ALTER TABLE "stockTransfers_details" DROP CONSTRAINT "stockTransfers_details_pkey",
DROP COLUMN "Id",
ADD CONSTRAINT "stockTransfers_details_pkey" PRIMARY KEY ("TransProductId", "ProductId");

-- AddForeignKey
ALTER TABLE "purchase_return_details" ADD CONSTRAINT "purchase_return_details_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "products"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockTransfers_details" ADD CONSTRAINT "stockTransfers_details_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "products"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
