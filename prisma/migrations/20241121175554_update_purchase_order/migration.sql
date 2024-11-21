/*
  Warnings:

  - The primary key for the `purchase_order_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CreateAt` on the `purchase_order_details` table. All the data in the column will be lost.
  - You are about to drop the column `Id` on the `purchase_order_details` table. All the data in the column will be lost.
  - You are about to drop the column `UpdateAt` on the `purchase_order_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "purchase_order_details" DROP CONSTRAINT "purchase_order_details_pkey",
DROP COLUMN "CreateAt",
DROP COLUMN "Id",
DROP COLUMN "UpdateAt",
ADD CONSTRAINT "purchase_order_details_pkey" PRIMARY KEY ("PurchaseOrderId", "ProductId");
