-- CreateTable
CREATE TABLE "warehouses" (
    "Id" SERIAL NOT NULL,
    "Code" TEXT NOT NULL,
    "Address" TEXT,
    "StaffName" TEXT NOT NULL,
    "StaffId" INTEGER NOT NULL,
    "TimeCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CompanyId" INTEGER NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "producers" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Origin" TEXT NOT NULL,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "WarehouseId" INTEGER NOT NULL,

    CONSTRAINT "producers_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "categories" (
    "Id" SERIAL NOT NULL,
    "Code" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "CreateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "WarehouseId" INTEGER NOT NULL,
    "ProducerId" INTEGER NOT NULL,

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
    "ProducerId" INTEGER NOT NULL,

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
    "ProducerId" INTEGER NOT NULL,
    "Size" TEXT NOT NULL,
    "Material" TEXT NOT NULL,
    "Color" TEXT NOT NULL,
    "Design" TEXT NOT NULL,
    "describe" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_Code_key" ON "warehouses"("Code");

-- CreateIndex
CREATE UNIQUE INDEX "categories_Code_key" ON "categories"("Code");

-- CreateIndex
CREATE UNIQUE INDEX "classifies_Code_key" ON "classifies"("Code");

-- CreateIndex
CREATE UNIQUE INDEX "products_Code_key" ON "products"("Code");

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "users"("CompanyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producers" ADD CONSTRAINT "producers_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_ProducerId_fkey" FOREIGN KEY ("ProducerId") REFERENCES "producers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classifies" ADD CONSTRAINT "classifies_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classifies" ADD CONSTRAINT "classifies_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "categories"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classifies" ADD CONSTRAINT "classifies_ProducerId_fkey" FOREIGN KEY ("ProducerId") REFERENCES "producers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_ClassifyId_fkey" FOREIGN KEY ("ClassifyId") REFERENCES "classifies"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "categories"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_WarehouseId_fkey" FOREIGN KEY ("WarehouseId") REFERENCES "warehouses"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_ProducerId_fkey" FOREIGN KEY ("ProducerId") REFERENCES "producers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
