import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class signUpDto {
  // dang ky
  @IsNotEmpty()
  @IsString()
  name: string

  address: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  @IsString ()
  password: string
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
