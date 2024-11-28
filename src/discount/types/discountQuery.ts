import { DiscountType } from "@prisma/client";

export type DiscountQuery = {
  code: string;
  name: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  type: DiscountType;
}