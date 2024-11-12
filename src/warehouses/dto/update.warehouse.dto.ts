import { Transform } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateWarehouse {
  @IsString()
  @IsOptional()
  name?: string

  @IsOptional()
  @IsString()
  address?: string

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  staffId?: number
}