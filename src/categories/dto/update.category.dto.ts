import { IsOptional, IsString } from "class-validator";

export class UpdateCategory {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  isRestock?: boolean;
}