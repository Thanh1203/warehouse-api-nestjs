/*
  Warnings:

  - Added the required column `CompanyId` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `WarehouseId` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CompanyId` to the `purchase_orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "CompanyId" INTEGER NOT NULL,
ADD COLUMN     "Discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "WarehouseId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "purchase_orders" ADD COLUMN     "CompanyId" INTEGER NOT NULL,
ADD COLUMN     "WarehouseIds" INTEGER[];

-- CreateTable
CREATE TABLE "discountOffers" (
    "Id" SERIAL NOT NULL,
    "Code" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "StartDate" TIMESTAMP(3) NOT NULL,
    "EndDate" TIMESTAMP(3) NOT NULL,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP(3) NOT NULL,
    "CustomerId" INTEGER NOT NULL,
    "CompanyId" INTEGER NOT NULL,

    CONSTRAINT "discountOffers_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "discountOffers_Code_key" ON "discountOffers"("Code");

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discountOffers" ADD CONSTRAINT "discountOffers_CustomerId_fkey" FOREIGN KEY ("CustomerId") REFERENCES "customers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discountOffers" ADD CONSTRAINT "discountOffers_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;
