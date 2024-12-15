import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class InsertProduct {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  name: string

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  categoryId: number

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  classifyId: number

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  supplierId: number

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  warehouseId: number

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
}