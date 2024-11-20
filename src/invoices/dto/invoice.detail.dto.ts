export class InvoiceProductsDto {
  Code: string;
  Name: string;
  Quantity: number;
  Price: number;
  Total: number;
}

export class InvoiceDetailDto {
  Id: number;
  Code: string;
  CustomerPhone: string;
  CustomerName: string;
  StaffId: number;
  StaffName: string;
  WarehouseName: string;
  Address: string;
  Discount: number;
  Total: number;
  products: InvoiceProductsDto[];
}