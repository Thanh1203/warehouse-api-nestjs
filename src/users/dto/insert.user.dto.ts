import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class InsertUserDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsString()
  @IsOptional()
  address?: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  @IsString ()
  password: string

  @IsNotEmpty()
  @IsString()
  phone: string

  @IsNotEmpty()
  @IsString()
  role: string
}