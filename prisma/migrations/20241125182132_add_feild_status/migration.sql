-- CreateEnum
CREATE TYPE "ProductOrderStatus" AS ENUM ('PENDING', 'RECEIVE_ALL', 'REFUND', 'RECEIVED_PART');

-- AlterTable
ALTER TABLE "purchase_order_details" ADD COLUMN     "Status" "ProductOrderStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "purchase_return_details" ADD COLUMN     "Status" "ProductOrderStatus" NOT NULL DEFAULT 'REFUND';
