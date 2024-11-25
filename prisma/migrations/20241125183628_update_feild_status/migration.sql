/*
  Warnings:

  - The values [RECEIVE_ALL,RECEIVED_PART] on the enum `ProductOrderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductOrderStatus_new" AS ENUM ('PENDING', 'RECEIVED', 'RECEIVING', 'SENT', 'SENDING', 'REFUND', 'CANCELLED');
ALTER TABLE "purchase_order_details" ALTER COLUMN "Status" DROP DEFAULT;
ALTER TABLE "purchase_return_details" ALTER COLUMN "Status" DROP DEFAULT;
ALTER TABLE "purchase_order_details" ALTER COLUMN "Status" TYPE "ProductOrderStatus_new" USING ("Status"::text::"ProductOrderStatus_new");
ALTER TABLE "purchase_return_details" ALTER COLUMN "Status" TYPE "ProductOrderStatus_new" USING ("Status"::text::"ProductOrderStatus_new");
ALTER TYPE "ProductOrderStatus" RENAME TO "ProductOrderStatus_old";
ALTER TYPE "ProductOrderStatus_new" RENAME TO "ProductOrderStatus";
DROP TYPE "ProductOrderStatus_old";
ALTER TABLE "purchase_order_details" ALTER COLUMN "Status" SET DEFAULT 'PENDING';
ALTER TABLE "purchase_return_details" ALTER COLUMN "Status" SET DEFAULT 'REFUND';
COMMIT;

-- AlterEnum
ALTER TYPE "PurchaseOrderStatus" ADD VALUE 'SENDING';
