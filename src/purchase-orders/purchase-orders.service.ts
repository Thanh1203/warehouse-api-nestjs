import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsPurchaseOrder, PurchaseOrderDetail, WarehousePurchaseOrder } from './types';
import { ProductOrderStatus, PurchaseOrderStatus } from '@prisma/client';
import { InsertPurchaseOrder, InsertPurchaseReturnDetail, UpdatePurchaseOrder, UpdatePurchaseOrderDetail } from './dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(private prismaService: PrismaService) { }

  async getAllPurchasesOrders(companyId: number) {
    const result = await this.prismaService.purchase_Orders.findMany({
      where: {
        CompanyId: companyId,
      },
      include: {
        suppliers: {
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

    return result.map(purchaseOrder => {
      const { suppliers, staff, ...purchaseOrders } = purchaseOrder;
      return {
        ...purchaseOrders,
        supplierName: suppliers.Name,
        staffName: staff.Name,
      }
    });
  }

  async getDetailPurchaseOrder(companyId: number, id: number) {
    const purchaseOrderDetail = await this.prismaService.purchase_Orders.findUnique({
      where: {
        CompanyId: companyId,
        Id: id,
      },
      include: {
        suppliers: {
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
    
    const productsOrder: ProductsPurchaseOrder[] = await this.prismaService.purchase_Order_Details.findMany({
      where: {
        PurchaseOrderId: id,
        Status: purchaseOrderDetail.Status === PurchaseOrderStatus.RECEIVED_PART ? ProductOrderStatus.REFUND : purchaseOrderDetail.Status,
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
      productId: product?.ProductId,
      name: product?.product.Name,
      quantity: product?.Quantity ?? 0,
      price: product?.Price ?? 0,
      total: product?.Total ?? 0,
    })));

    const warehouses: WarehousePurchaseOrder[] = await this.prismaService.warehouses.findMany({
      where: {
        Id: {
          in: purchaseOrderDetail.WarehouseIds
        }
      },
      select: {
        Id: true,
        Code: true,
        Name: true,
        Address: true,
      }
    }).then(data => data.map(warehouse => ({
      id: warehouse?.Id,
      code: warehouse?.Code,
      name: warehouse?.Name,
      address: warehouse?.Address,
    })));
    
    const result: PurchaseOrderDetail = {
      id: purchaseOrderDetail?.Id,
      code: purchaseOrderDetail?.Code,
      createAt: purchaseOrderDetail?.CreateAt,
      UpdateAt: purchaseOrderDetail?.UpdateAt,
      supplierId: purchaseOrderDetail?.SupplierId,
      supplierName: purchaseOrderDetail?.suppliers.Name,
      warehouses: warehouses,
      staffId: purchaseOrderDetail?.StaffId,
      staffName: purchaseOrderDetail?.staff.Name,
      total: purchaseOrderDetail?.Total,
      status: purchaseOrderDetail?.Status,
      products: productsOrder,
    }

    return result;
  }

  async searchPurchaseOrders(companyId: number, status: PurchaseOrderStatus, code: string, warehouseIds: number[], createdAt: Date, supplierIds: number[], staffIds: number[]) {
    const result = await this.prismaService.purchase_Orders.findMany({
      where: {
      CompanyId: companyId,
      ...(status ? { Status: status } : {}),
      ...(code ? { Code: code } : {}),
      ...(warehouseIds ? { WarehouseIds: { hasSome: warehouseIds } } : {}),
      ...(createdAt ? { CreateAt: { gte: createdAt, lte: new Date() } } : {}),
      ...(supplierIds ? { SupplierId: { in: supplierIds } } : {}),
      ...(staffIds ? { StaffId: { in: staffIds } } : {}),
      },
      include: {
      suppliers: {
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

    return result.map(purchaseOrder => {
      const { suppliers, staff, ...purchaseOrders } = purchaseOrder;
      return {
        ...purchaseOrders,
        supplierName: suppliers.Name,
        staffName: staff.Name,
      }
    });
  }

  async createPurchaseOrder(companyId: number, dto: InsertPurchaseOrder) {
    const { detail, ...purchaseOrderData } = dto;
    const newPurchaseOrder = await this.prismaService.purchase_Orders.create({
      data: {
        Code: purchaseOrderData.code,
        SupplierId: purchaseOrderData.supplierId,
        WarehouseIds: {
          set: purchaseOrderData.WarehouseIds,
        },
        StaffId: purchaseOrderData.staffId,
        CompanyId: companyId,
        Total: purchaseOrderData.total,
        Status: purchaseOrderData.status,
        purchase_order_details: {
          create: detail.map(item => ({
            ProductId: item.productId,
            Quantity: item.quantity,
            Price: item.price,
            Total: item.total,
          }))
        }
      }
    });

    return newPurchaseOrder;
  }

  async updatePurchaseOrder(companyId: number, id: number, dto: UpdatePurchaseOrder) { 
    return await this.prismaService.purchase_Orders.update({
      where: {
        CompanyId: companyId,
        Id: id,
      },
      data: {
        SupplierId: dto.supplierId,
        StaffId: dto.staffId,
        WarehouseIds: {
          set: dto.WarehouseIds,
        },
        Status: dto.status,
      }
    });
  }

  async updatePurchaseOrderDetail(companyId: number, purchaseOrderId: number, dto: UpdatePurchaseOrderDetail[]) {
    // Lấy danh sách sản phẩm hiện tại trong đơn đặt hàng
    const currentProducts = await this.prismaService.purchase_Order_Details.findMany({
      where: {
        PurchaseOrderId: purchaseOrderId,
      },
      select: {
        ProductId: true,
      }
    });

    // Kiểm tra nhanh sản phẩm hiện có
    const existingProducts = currentProducts.map(product => product.ProductId);
    dto.forEach(async (product: UpdatePurchaseOrderDetail) => {
      const { productId, quantity, price, total } = product;
      // Nếu sản phẩm đã tồn tại thì cập nhật số lượng, giá và tổng tiền
      if (existingProducts.includes(productId)) {
        await this.prismaService.purchase_Order_Details.update({
          where: {
            PurchaseOrderId_ProductId: {
              PurchaseOrderId: purchaseOrderId,
              ProductId: productId
            }
          },
          data: {
            Quantity: quantity,
            Price: price,
            Total: total,
          }
        })
      } else {
        // Nếu sản phẩm chưa tồn tại thì tạo mới
        await this.prismaService.purchase_Order_Details.create({
          data: {
            PurchaseOrderId: purchaseOrderId,
            ProductId: productId,
            Quantity: quantity,
            Price: price,
            Total: total,
          }
        })
      }
    });
  }

  async deletePurchaseOrder(companyId: number, ids: number[]): Promise<{message: string}> {
    try {
      await this.prismaService.purchase_Order_Details.deleteMany({
        where: {
          PurchaseOrderId: { in: ids }
        }
      });

      await this.prismaService.purchase_Orders.deleteMany({
        where: {
          Id: { in: ids }
        }
      });
      
      return {
        message: 'Delete purchase order successfully',
      };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Failed to delete pruchase order');
    }
  }

  async createPurchaseReturn(companyId: number, id: number, dto: InsertPurchaseReturnDetail) {
    try {
      await this.prismaService.purchase_Orders.update({
        where: {
          CompanyId: companyId,
          Id: id,
        },
        data: {
          Status: PurchaseOrderStatus.RECEIVED_PART,
        }
      });

      return await this.prismaService.purchase_Return_Details.create({
        data: {
          PurchaseOrderId: id,
          ProductId: dto.productId,
          Quantity: dto.quantity,
          Price: dto.price,
          Total: dto.total,
        }
      });

    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Failed to retrun product');
    }
  }
}
