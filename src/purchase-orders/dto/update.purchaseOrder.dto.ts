import { PurchaseOrderStatus } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class UpdatePurchaseOrderDetail {
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

  @IsString()
  @IsOptional()
  status?: PurchaseOrderStatus;
}

export class UpdatePurchaseOrder {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  supplierId: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  staffId?: number;

  WarehouseIds: number[];

  @IsNotEmpty()
  @IsString()
  status: PurchaseOrderStatus;

  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsNumber()
  total?: number;
}