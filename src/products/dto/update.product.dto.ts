import { ProductStatus } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProduct {
  @IsString()
  @IsOptional()
  name?: string

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  categoryId?: number
  
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  classifyId?: number

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  supplierId?: number

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  warehouseId?: number

  @IsString()
  @IsOptional()
  size?: string

  @IsString()
  @IsOptional()
  material?: string

  @IsString()
  @IsOptional()
  color?: string

  @IsString()
  @IsOptional()
  design?: string

  @IsString()
  @IsOptional()
  describe?: string

  @IsString()
  @IsOptional()
  status?: ProductStatus
}