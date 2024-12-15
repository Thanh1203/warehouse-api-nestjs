/*
  Warnings:

  - You are about to drop the column `WarehouseIds` on the `purchase_orders` table. All the data in the column will be lost.
  - Added the required column `WarehouseId` to the `purchase_orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "purchase_orders" DROP COLUMN "WarehouseIds",
ADD COLUMN     "WarehouseId" INTEGER NOT NULL;
