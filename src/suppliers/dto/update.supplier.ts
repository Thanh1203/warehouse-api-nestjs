import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateSupplier {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  origin?: string

  @IsBoolean()
  @IsOptional()
  isCollab?: boolean
}