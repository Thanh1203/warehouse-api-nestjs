import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class InsertWarehouse {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsString()
  address?: string

  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  @IsNumber()
  staffId: number
}