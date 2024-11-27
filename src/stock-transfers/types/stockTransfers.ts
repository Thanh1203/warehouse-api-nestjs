import { ProductTransfers } from "./productTransfers";

export type StockTransfers = {
  id: number;
  code: string;
  staffId: number;
  quantity: number;
  fromWarehouseId: number;
  fromWarehouseName: string;
  toWarehouseId: number;
  toWarehouseName: string;
  status: string;
  products: ProductTransfers[];
}