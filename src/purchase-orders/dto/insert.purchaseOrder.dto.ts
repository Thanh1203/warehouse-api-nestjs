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

class OrderWarehoseId {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  warehouseId: number;
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

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderWarehoseId)
  WarehouseIds: OrderWarehoseId[];

  @IsNotEmpty()
  @IsString()
  status: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsNumber()
  total?: number;

  details: InsertPurchaseOrderDetail[];
}