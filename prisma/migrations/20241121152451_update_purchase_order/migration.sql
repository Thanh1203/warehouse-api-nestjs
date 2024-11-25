-- AlterTable
ALTER TABLE "purchase_order_details" ALTER COLUMN "Quantity" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_StaffId_fkey" FOREIGN KEY ("StaffId") REFERENCES "users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
