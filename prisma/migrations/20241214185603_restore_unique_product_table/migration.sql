/*
  Warnings:

  - A unique constraint covering the columns `[Code]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "products_Code_key" ON "products"("Code");
