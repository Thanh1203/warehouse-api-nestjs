import { DiscountType } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CustomerDiscountsDto } from "./customer.discount.dto";

export class InsertDiscountOfferDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({
    maxDecimalPlaces: 3
  })
  @IsOptional()
  discount?: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;
  
  @IsNotEmpty()
  @IsString()
  type: DiscountType;

  discountForCustomer: CustomerDiscountsDto[];
}