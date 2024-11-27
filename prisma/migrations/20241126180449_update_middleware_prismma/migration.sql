/*
  Warnings:

  - You are about to drop the column `CreateAt` on the `stockTransfers_details` table. All the data in the column will be lost.
  - You are about to drop the column `UpdateAt` on the `stockTransfers_details` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "StockTransferStatus" AS ENUM ('PENDING', 'RECEIVED', 'RECEIVING', 'SENT', 'SENDING', 'CANCELLED');

-- AlterTable
ALTER TABLE "stockTransfers" ADD COLUMN     "Status" "StockTransferStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "stockTransfers_details" DROP COLUMN "CreateAt",
DROP COLUMN "UpdateAt",
ADD COLUMN     "Status" "StockTransferStatus" NOT NULL DEFAULT 'PENDING';
