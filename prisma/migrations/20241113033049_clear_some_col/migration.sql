/*
  Warnings:

  - Added the required column `WarehouseId` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "invoice_details" DROP CONSTRAINT "invoice_details_ProductId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_order_details" DROP CONSTRAINT "purchase_order_details_ProductId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_return_details" DROP CONSTRAINT "purchase_return_details_ProductId_fkey";

-- DropForeignKey
ALTER TABLE "stockTransfers_details" DROP CONSTRAINT "stockTransfers_details_ProductId_fkey";

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "WarehouseId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
