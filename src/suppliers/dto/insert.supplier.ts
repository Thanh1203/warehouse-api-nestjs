import { IsNotEmpty, IsString } from "class-validator";

export class InsertSupplier {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  origin: string
}