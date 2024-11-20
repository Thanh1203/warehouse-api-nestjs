-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_StaffId_fkey" FOREIGN KEY ("StaffId") REFERENCES "users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
