import { ProductsInvoice } from "./productsInvoice";

export type InvoiceDetail = {
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
  products: ProductsInvoice[];
}