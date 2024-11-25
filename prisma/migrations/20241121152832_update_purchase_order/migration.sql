-- AddForeignKey
ALTER TABLE "purchase_order_details" ADD CONSTRAINT "purchase_order_details_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "products"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
