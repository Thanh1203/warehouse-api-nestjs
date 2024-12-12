import { StatusUser } from "@prisma/client"
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  address?: string

  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string

  // @IsString()
  // @IsOptional()
  // password?: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsString()
  @IsOptional()
  role?: string

  @IsString()
  @IsOptional()
  status?: StatusUser
}