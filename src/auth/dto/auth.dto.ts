import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class signUpDto {
  // dang ky
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
}

export class signInDto {
  // dang nhap
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  @IsString ()
  password: string
}
