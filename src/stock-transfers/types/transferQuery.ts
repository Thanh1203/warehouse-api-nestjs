import { StockTransferStatus } from "@prisma/client";

export class TransfersQuery {
  idFrom?: number;
  idTo?: number;
  createAt?: Date;
  status?: StockTransferStatus;
  code?: string;
}