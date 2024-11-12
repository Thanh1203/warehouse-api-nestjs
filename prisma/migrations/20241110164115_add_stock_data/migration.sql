/*
  Warnings:

  - You are about to drop the column `Quantity` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `WarehouseId` on the `products` table. All the data in the column will be lost.
  - Added the required column `UpdateAt` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK');

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_WarehouseId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "Quantity",
DROP COLUMN "WarehouseId",
ADD COLUMN     "UpdateAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Price_Configuration" (
    "Id" SERIAL NOT NULL,
    "ProductId" INTEGER NOT NULL,
    "WarehouseId" INTEGER NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Price_Configuration_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Stock_items" (
    "Id" SERIAL NOT NULL,
    "ProductId" INTEGER NOT NULL,
    "WarehouseId" INTEGER NOT NULL,
    "Quantity" INTEGER NOT NULL DEFAULT 0,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP(3) NOT NULL,
    "Status" "ProductStatus" NOT NULL DEFAULT 'OUT_OF_STOCK',

    CONSTRAINT "Stock_items_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Price_Configuration" ADD CONSTRAINT "Price_Configuration_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "products"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price_Configuration" ADD CONSTRAINT "Price_Configuration_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock_items" ADD CONSTRAINT "Stock_items_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "products"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock_items" ADD CONSTRAINT "Stock_items_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
