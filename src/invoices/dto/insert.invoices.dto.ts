import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { InsertDetailInvoice } from "./insert.invoices.detail.dto";

export class InsertInvoice {
  @IsString()
  @IsNotEmpty()
  code: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  staffId: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  total: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  warehouseId: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @ValidateNested({ each: true })
  @Type(() => InsertDetailInvoice)
  detail: InsertDetailInvoice[];
}