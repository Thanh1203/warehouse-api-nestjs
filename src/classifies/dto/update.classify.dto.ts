import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateClassify {
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
  supplierId?: number

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  warehouseId?: number

  @IsOptional()
  @IsBoolean()
  isRestock?: boolean;
}