import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class InsertCategory {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  warehouseId: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  supplierId: number;
}