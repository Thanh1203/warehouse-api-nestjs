import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockTransferStatus } from '@prisma/client';
import { ProductTransfers, StockTransfers, TransfersQuery } from './types';
import { InsertStockTransfersDto, UpdateStockTransferDetail, UpdateStockTransfersDto } from './dto';

@Injectable()
export class StockTransfersService {
  constructor(private prismaService: PrismaService) { }
  
  async getAllStockTransfers(companyId: number) {
    const result = await this.prismaService.stockTransfers.findMany({
      where: {
        CompanyId: companyId,
      },
      include: {
        fromWarehouse: {
          select: {
            Name: true,
          }
        },
        toWarehouse: {
          select: {
            Name: true,
          }
        },
        staff: {
          select: {
            Name: true,
          }
        }
      }
    })
    return result.map(stockTransfer => {
      const { fromWarehouse, toWarehouse, staff, ...stockTransfers } = stockTransfer;
      return {
        ...stockTransfers,
        fromWarehouseName: fromWarehouse.Name,
        toWarehouseName: toWarehouse.Name,
        staffName: staff.Name,
      }
    });
  }
  
  async searchStockTransfers(companyId: number, query: Record<string, any>) {
    const { idFrom, idTo, createAt, status, code } = query as TransfersQuery;
    const result = await this.prismaService.stockTransfers.findMany({
      where: {
        CompanyId: companyId,
        ...(idFrom ? { FromWarehouseId: idFrom } : {}),
        ...(idTo ? { ToWarehouseId: idTo } : {}),
        ...(createAt ? { CreateAt: { gte: createAt } } : {}),
        ...(status ? { Status: status } : {}),
        ...(code ? {
          Code: {
            contains: code,
            mode: 'insensitive',
          }
        } : {}),
      },
      include: {
        fromWarehouse: {
          select: {
            Name: true,
          }
        },
        toWarehouse: {
          select: {
            Name: true,
          }
        },
        staff: {
          select: {
            Name: true,
          }
        }
      }
    });
    return result.map(stockTransfer => {
      const { fromWarehouse, toWarehouse, staff, ...stockTransfers } = stockTransfer;
      return {
        ...stockTransfers,
        fromWarehouseName: fromWarehouse.Name,
        toWarehouseName: toWarehouse.Name,
        staffName: staff.Name,
      }
    });
  }

  async getDetailStockTransfer(companyId: number, id: number) { 
    const stockTransferDetail = await this.prismaService.stockTransfers.findUnique({
      where: {
        Id: id,
      },
      include: {
        fromWarehouse: {
          select: {
            Name: true,
          }
        },
        toWarehouse: {
          select: {
            Name: true,
          }
        },
        staff: {
          select: {
            Name: true,
          }
        },
      }
    });

    const productsTransfer: ProductTransfers[] = await this.prismaService.stockTransfers_Details.findMany({
      where: {
        TransProductId: id,
        Status: stockTransferDetail.Status,
      },
      include: {
        product: {
          select: {
            Name: true,
            Code: true,
          }
        }
      }
    }).then(data => data.map(product => ({
      productId: product.ProductId,
      name: product.product.Name,
      status: product.Status,
      quantity: product.Quantity,
    })));

    const result: StockTransfers = {
      id: stockTransferDetail.Id,
      code: stockTransferDetail.Code,
      staffId: stockTransferDetail.StaffId,
      quantity: stockTransferDetail.Quantity,
      fromWarehouseId: stockTransferDetail.FromWarehouseId,
      fromWarehouseName: stockTransferDetail.fromWarehouse.Name,
      toWarehouseId: stockTransferDetail.ToWarehouseId,
      toWarehouseName: stockTransferDetail.toWarehouse.Name,
      status: stockTransferDetail.Status,
      products: productsTransfer,
    }

    return result;
  }
  
  async createStockTransfer(companyId: number, dto: InsertStockTransfersDto) { 
    const { detail, ...stockTransfer } = dto;
    const newStockTransfer = await this.prismaService.stockTransfers.create({
      data: {
        Code: stockTransfer.code,
        StaffId: stockTransfer.staffId,
        Quantity: stockTransfer.quantity,
        FromWarehouseId: stockTransfer.fromWarehouseId,
        ToWarehouseId: stockTransfer.toWarehouseId,
        CompanyId: companyId,
        Status: StockTransferStatus.PENDING,
        StockTransfers_details: {
          create: detail.map(item => ({
            ProductId: item.productId,
            Quantity: item.quantity,
            Status: StockTransferStatus.PENDING,
          }))
        }
      }
    });

    return newStockTransfer;
  }
  
  async updateStockTransfer(companyId: number, id: number, dto: UpdateStockTransfersDto) {
    return await this.prismaService.stockTransfers.update({
      where: {
        Id: id,
        CompanyId: companyId,
      },
      data: {
        StaffId: dto.staffId,
        Quantity: dto.quantity,
        FromWarehouseId: dto.fromWarehouseId,
        ToWarehouseId: dto.toWarehouseId,
        Status: dto.status,
      }
    });
  }
  
  async updateStockTransferDetail(companyId: number, id: number, dto: UpdateStockTransferDetail[]) {
    const currentProducts = await this.prismaService.stockTransfers_Details.findMany({
      where: {
        TransProductId: id,
      },
      select: {
        ProductId: true,
      }
    });

    const existingProducts = currentProducts.map(product => product.ProductId);
    dto.forEach(async (product: UpdateStockTransferDetail) => {
      const { productId, quantity, status } = product;
      if (existingProducts.includes(productId)) {
        await this.prismaService.stockTransfers_Details.update({
          where: {
            TransProductId_ProductId: {
              ProductId: productId,
              TransProductId: id,
            }
          }, 
          data: {
            Quantity: quantity,
            Status: status,
          }
        })
      } else {
        await this.prismaService.stockTransfers_Details.create({
          data: {
            TransProductId: id,
            ProductId: productId,
            Quantity: quantity,
            Status: status,
          }
        });
      }
    });
  }

  async deleteStockTransfers(companyId: number, ids: number[]): Promise<{ message: string }> {
    try {
      await this.prismaService.stockTransfers_Details.deleteMany({
        where: {
          TransProductId: {
            in: ids,
          }
        }
      })

      await this.prismaService.stockTransfers.deleteMany({
        where: {
          Id: {
            in: ids,
          }
        }
      });

      return { message: 'Delete stock transfer successfully' };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Failed to delete stock transfer');
    }  
  }
}
