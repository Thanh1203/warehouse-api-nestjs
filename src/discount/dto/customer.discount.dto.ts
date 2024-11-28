import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CustomerDiscountsDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  discountId: number;
}