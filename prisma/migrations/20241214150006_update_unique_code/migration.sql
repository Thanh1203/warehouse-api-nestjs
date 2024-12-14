/*
  Warnings:

  - A unique constraint covering the columns `[Code]` on the table `Suppliers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Suppliers_Code_key" ON "Suppliers"("Code");
