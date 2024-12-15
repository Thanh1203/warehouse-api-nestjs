/*
  Warnings:

  - Changed the type of `WarehouseIds` on the `purchase_orders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "purchase_orders" DROP COLUMN "WarehouseIds",
ADD COLUMN     "WarehouseIds" INTEGER NOT NULL;
