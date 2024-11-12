-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('PENDING', 'RECEIVED', 'CANCELLED', 'SENT', 'RECEIVING', 'RECEIVED_PART');

-- CreateTable
CREATE TABLE "customers" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Phone" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP(3) NOT NULL,
    "total_spent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "purchase_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "Id" SERIAL NOT NULL,
    "Code" TEXT NOT NULL,
    "CustomerId" INTEGER NOT NULL,
    "StaffId" INTEGER NOT NULL,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Total" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "invoice_details" (
    "Id" SERIAL NOT NULL,
    "InvoiceId" INTEGER NOT NULL,
    "ProductId" INTEGER NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL,
    "Total" DOUBLE PRECISION NOT NULL,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_details_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "Id" SERIAL NOT NULL,
    "Code" TEXT NOT NULL,
    "SupplierId" INTEGER NOT NULL,
    "StaffId" INTEGER NOT NULL,
    "Total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP(3) NOT NULL,
    "Status" "PurchaseOrderStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "purchase_order_details" (
    "Id" SERIAL NOT NULL,
    "PurchaseOrderId" INTEGER NOT NULL,
    "ProductId" INTEGER NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP(3) NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "Total" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "purchase_order_details_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "purchase_return_details" (
    "Id" SERIAL NOT NULL,
    "PurchaseOrderId" INTEGER NOT NULL,
    "ProductId" INTEGER NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP(3) NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "Total" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "purchase_return_details_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "stockTransfers" (
    "Id" SERIAL NOT NULL,
    "StaffId" INTEGER NOT NULL,
    "Code" TEXT NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "FromWarehouseId" INTEGER NOT NULL,
    "ToWarehouseId" INTEGER NOT NULL,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stockTransfers_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "stockTransfers_details" (
    "Id" SERIAL NOT NULL,
    "TransProductId" INTEGER NOT NULL,
    "ProductId" INTEGER NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stockTransfers_details_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_Phone_key" ON "customers"("Phone");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_Code_key" ON "invoices"("Code");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_Code_key" ON "purchase_orders"("Code");

-- CreateIndex
CREATE UNIQUE INDEX "stockTransfers_Code_key" ON "stockTransfers"("Code");

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_CustomerId_fkey" FOREIGN KEY ("CustomerId") REFERENCES "customers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_details" ADD CONSTRAINT "invoice_details_InvoiceId_fkey" FOREIGN KEY ("InvoiceId") REFERENCES "invoices"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_details" ADD CONSTRAINT "invoice_details_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "products"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_SupplierId_fkey" FOREIGN KEY ("SupplierId") REFERENCES "Suppliers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_details" ADD CONSTRAINT "purchase_order_details_PurchaseOrderId_fkey" FOREIGN KEY ("PurchaseOrderId") REFERENCES "purchase_orders"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_details" ADD CONSTRAINT "purchase_order_details_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "products"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_return_details" ADD CONSTRAINT "purchase_return_details_PurchaseOrderId_fkey" FOREIGN KEY ("PurchaseOrderId") REFERENCES "purchase_orders"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_return_details" ADD CONSTRAINT "purchase_return_details_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "products"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockTransfers" ADD CONSTRAINT "stockTransfers_StaffId_fkey" FOREIGN KEY ("StaffId") REFERENCES "users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockTransfers" ADD CONSTRAINT "stockTransfers_FromWarehouseId_fkey" FOREIGN KEY ("FromWarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockTransfers" ADD CONSTRAINT "stockTransfers_ToWarehouseId_fkey" FOREIGN KEY ("ToWarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockTransfers_details" ADD CONSTRAINT "stockTransfers_details_TransProductId_fkey" FOREIGN KEY ("TransProductId") REFERENCES "stockTransfers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockTransfers_details" ADD CONSTRAINT "stockTransfers_details_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "products"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
