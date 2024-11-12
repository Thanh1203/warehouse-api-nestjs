/*
  Warnings:

  - You are about to drop the `Price_Configuration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stock_items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Price_Configuration" DROP CONSTRAINT "Price_Configuration_ProductId_fkey";

-- DropForeignKey
ALTER TABLE "Price_Configuration" DROP CONSTRAINT "Price_Configuration_WarehouseId_fkey";

-- DropForeignKey
ALTER TABLE "Stock_items" DROP CONSTRAINT "Stock_items_ProductId_fkey";

-- DropForeignKey
ALTER TABLE "Stock_items" DROP CONSTRAINT "Stock_items_WarehouseId_fkey";

-- DropTable
DROP TABLE "Price_Configuration";

-- DropTable
DROP TABLE "Stock_items";

-- CreateTable
CREATE TABLE "price_configuration" (
    "Id" SERIAL NOT NULL,
    "ProductId" INTEGER NOT NULL,
    "WarehouseId" INTEGER NOT NULL,
    "CompanyId" INTEGER NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_configuration_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "Id" SERIAL NOT NULL,
    "ProductId" INTEGER NOT NULL,
    "WarehouseId" INTEGER NOT NULL,
    "CompanyId" INTEGER NOT NULL,
    "Quantity" INTEGER NOT NULL DEFAULT 0,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP(3) NOT NULL,
    "Status" "ProductStatus" NOT NULL DEFAULT 'OUT_OF_STOCK',

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "price_configuration" ADD CONSTRAINT "price_configuration_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "products"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_configuration" ADD CONSTRAINT "price_configuration_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_configuration" ADD CONSTRAINT "price_configuration_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "products"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;
