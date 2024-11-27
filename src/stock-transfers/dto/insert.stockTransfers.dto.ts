import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class InsertStockTransfersDetailDto { 
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class InsertStockTransfersDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  @IsNumber()
  staffId: number;

  @IsString()
  @IsNotEmpty()
  code: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  @IsNumber()
  fromWarehouseId: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  @IsNumber()
  toWarehouseId: number;

  detail: InsertStockTransfersDetailDto[];
}