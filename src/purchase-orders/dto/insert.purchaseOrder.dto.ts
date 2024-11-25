import { PurchaseOrderStatus } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class InsertPurchaseOrderDetail {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  price?: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  total?: number;
}

export class InsertPurchaseOrder {
  @IsNotEmpty()
  @IsString()
  code: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  supplierId: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  staffId: number;

  WarehouseIds: number[];

  @IsNotEmpty()
  @IsString()
  status: PurchaseOrderStatus;

  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsNumber()
  total?: number;

  detail: InsertPurchaseOrderDetail[];
}