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

-- CreateIndex
CREATE UNIQUE INDEX "users_CompanyId_key" ON "users"("CompanyId");

-- CreateIndex
CREATE UNIQUE INDEX "users_Email_key" ON "users"("Email");
