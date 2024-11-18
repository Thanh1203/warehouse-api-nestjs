-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK');

-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('PENDING', 'RECEIVED', 'CANCELLED', 'SENT', 'RECEIVING', 'RECEIVED_PART');

-- CreateTable
CREATE TABLE "users" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Position" TEXT NOT NULL,
    "CompanyId" INTEGER NOT NULL,
    "Address" TEXT,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP(3) NOT NULL,
    "hashedRT" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Code" TEXT NOT NULL,
    "Address" TEXT,
    "StaffId" INTEGER NOT NULL,
    "TimeCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CompanyId" INTEGER NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Suppliers" (
    "Id" SERIAL NOT NULL,
    "Code" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Origin" TEXT NOT NULL,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CompanyId" INTEGER NOT NULL,
    "IsCollab" BOOLEAN NOT NULL,

    CONSTRAINT "Suppliers_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "categories" (
    "Id" SERIAL NOT NULL,
    "Code" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "WarehouseId" INTEGER NOT NULL,
    "SupplierId" INTEGER NOT NULL,
    "CompanyId" INTEGER NOT NULL,
    "IsRestock" BOOLEAN NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "classifies" (
    "Id" SERIAL NOT NULL,
    "Code" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CategoryId" INTEGER NOT NULL,
    "WarehouseId" INTEGER NOT NULL,
    "SupplierId" INTEGER NOT NULL,
    "CompanyId" INTEGER NOT NULL,
    "IsRestock" BOOLEAN NOT NULL,

    CONSTRAINT "classifies_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "products" (
    "Id" SERIAL NOT NULL,
    "Code" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP(3) NOT NULL,
    "CategoryId" INTEGER NOT NULL,
    "ClassifyId" INTEGER NOT NULL,
    "SupplierId" INTEGER NOT NULL,
    "CompanyId" INTEGER NOT NULL,
    "Size" TEXT NOT NULL,
    "Material" TEXT NOT NULL,
    "Color" TEXT NOT NULL,
    "Design" TEXT NOT NULL,
    "Describe" TEXT NOT NULL,
    "IsRestock" BOOLEAN NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "price_configuration" (
    "Id" SERIAL NOT NULL,
    "ProductId" INTEGER NOT NULL,
    "WarehouseId" INTEGER NOT NULL,
    "CompanyId" INTEGER NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_configuration_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "Id" SERIAL NOT NULL,
    "ProductId" INTEGER NOT NULL,
    "WarehouseId" INTEGER NOT NULL,
    "CompanyId" INTEGER NOT NULL,
    "Quantity" INTEGER NOT NULL DEFAULT 0,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP(3) NOT NULL,
    "Status" "ProductStatus" NOT NULL DEFAULT 'OUT_OF_STOCK',

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "customers" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Phone" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "Email" TEXT,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateAt" TIMESTAMP(3) NOT NULL,
    "total_spent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "purchase_count" INTEGER NOT NULL DEFAULT 0,
    "CompanyId" INTEGER NOT NULL,
    "WarehouseId" INTEGER NOT NULL,

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
CREATE UNIQUE INDEX "users_CompanyId_key" ON "users"("CompanyId");

-- CreateIndex
CREATE UNIQUE INDEX "users_Email_key" ON "users"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_Code_key" ON "warehouses"("Code");

-- CreateIndex
CREATE UNIQUE INDEX "Suppliers_Code_key" ON "Suppliers"("Code");

-- CreateIndex
CREATE UNIQUE INDEX "categories_Code_key" ON "categories"("Code");

-- CreateIndex
CREATE UNIQUE INDEX "classifies_Code_key" ON "classifies"("Code");

-- CreateIndex
CREATE UNIQUE INDEX "products_Code_key" ON "products"("Code");

-- CreateIndex
CREATE UNIQUE INDEX "customers_Phone_key" ON "customers"("Phone");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_Code_key" ON "invoices"("Code");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_Code_key" ON "purchase_orders"("Code");

-- CreateIndex
CREATE UNIQUE INDEX "stockTransfers_Code_key" ON "stockTransfers"("Code");

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_StaffId_fkey" FOREIGN KEY ("StaffId") REFERENCES "users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suppliers" ADD CONSTRAINT "Suppliers_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_SupplierId_fkey" FOREIGN KEY ("SupplierId") REFERENCES "Suppliers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classifies" ADD CONSTRAINT "classifies_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classifies" ADD CONSTRAINT "classifies_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "categories"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classifies" ADD CONSTRAINT "classifies_SupplierId_fkey" FOREIGN KEY ("SupplierId") REFERENCES "Suppliers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classifies" ADD CONSTRAINT "classifies_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_ClassifyId_fkey" FOREIGN KEY ("ClassifyId") REFERENCES "classifies"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "categories"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_SupplierId_fkey" FOREIGN KEY ("SupplierId") REFERENCES "Suppliers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_configuration" ADD CONSTRAINT "price_configuration_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "products"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_configuration" ADD CONSTRAINT "price_configuration_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_configuration" ADD CONSTRAINT "price_configuration_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "products"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_CustomerId_fkey" FOREIGN KEY ("CustomerId") REFERENCES "customers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_details" ADD CONSTRAINT "invoice_details_InvoiceId_fkey" FOREIGN KEY ("InvoiceId") REFERENCES "invoices"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_SupplierId_fkey" FOREIGN KEY ("SupplierId") REFERENCES "Suppliers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_details" ADD CONSTRAINT "purchase_order_details_PurchaseOrderId_fkey" FOREIGN KEY ("PurchaseOrderId") REFERENCES "purchase_orders"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_return_details" ADD CONSTRAINT "purchase_return_details_PurchaseOrderId_fkey" FOREIGN KEY ("PurchaseOrderId") REFERENCES "purchase_orders"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockTransfers" ADD CONSTRAINT "stockTransfers_StaffId_fkey" FOREIGN KEY ("StaffId") REFERENCES "users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockTransfers" ADD CONSTRAINT "stockTransfers_FromWarehouseId_fkey" FOREIGN KEY ("FromWarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockTransfers" ADD CONSTRAINT "stockTransfers_ToWarehouseId_fkey" FOREIGN KEY ("ToWarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockTransfers_details" ADD CONSTRAINT "stockTransfers_details_TransProductId_fkey" FOREIGN KEY ("TransProductId") REFERENCES "stockTransfers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
