import { DiscountType } from "@prisma/client";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { CustomerDiscountsDto } from "./customer.discount.dto";

export class UpdateDiscountOfferDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({
    maxDecimalPlaces: 3
  })
  @IsOptional()
  discount?: number;

  @IsOptional()
  @IsString()
  type?: DiscountType;
}