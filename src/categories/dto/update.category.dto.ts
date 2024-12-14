import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCategory {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isRestock?: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  supplierId?: number

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  warehouseId?: number
}