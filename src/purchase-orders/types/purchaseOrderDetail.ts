import { ProductsPurchaseOrder } from "./productsPurchaseOrder";
import { WarehousePurchaseOrder } from "./warehousesPurchaseOrder";

export type PurchaseOrderDetail = {
  id: number;
  code: string;
  createAt: Date;
  UpdateAt: Date;
  supplierId: number;
  supplierName: string;
  warehouses: WarehousePurchaseOrder[];
  staffId: number;
  staffName: string;
  total: number;
  status: string;
  products: ProductsPurchaseOrder[];
}