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
    "StaffName" TEXT NOT NULL,
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

    CONSTRAINT "classifies_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "products" (
    "Id" SERIAL NOT NULL,
    "Code" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CategoryId" INTEGER NOT NULL,
    "WarehouseId" INTEGER NOT NULL,
    "ClassifyId" INTEGER NOT NULL,
    "SupplierId" INTEGER NOT NULL,
    "CompanyId" INTEGER NOT NULL,
    "Size" TEXT NOT NULL,
    "Material" TEXT NOT NULL,
    "Color" TEXT NOT NULL,
    "Design" TEXT NOT NULL,
    "describe" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("Id")
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
ALTER TABLE "classifies" ADD CONSTRAINT "classifies_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classifies" ADD CONSTRAINT "classifies_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "categories"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classifies" ADD CONSTRAINT "classifies_SupplierId_fkey" FOREIGN KEY ("SupplierId") REFERENCES "Suppliers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_ClassifyId_fkey" FOREIGN KEY ("ClassifyId") REFERENCES "classifies"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "categories"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_SupplierId_fkey" FOREIGN KEY ("SupplierId") REFERENCES "Suppliers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;
