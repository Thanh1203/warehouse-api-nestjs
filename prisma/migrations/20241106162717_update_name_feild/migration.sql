/*
  Warnings:

  - You are about to drop the column `describe` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `products` table. All the data in the column will be lost.
  - Added the required column `Describe` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Quantity` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "describe",
DROP COLUMN "quantity",
ADD COLUMN     "Describe" TEXT NOT NULL,
ADD COLUMN     "Quantity" INTEGER NOT NULL;
