/*
  Warnings:

  - Added the required column `IsRestock` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IsRestock` to the `classifies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IsRestock` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "IsRestock" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "classifies" ADD COLUMN     "IsRestock" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "IsRestock" BOOLEAN NOT NULL;
