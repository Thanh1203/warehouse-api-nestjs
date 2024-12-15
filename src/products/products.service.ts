import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InsertProduct, UpdateProduct } from './dto';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  // Get all products
  async getInforProducts(
    companyId: number,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const [products, totalCount] = await this.prismaService.$transaction([
      this.prismaService.products.findMany({
        where: { CompanyId: companyId },
        // skip,
        // take: limit,
        orderBy: {
          Id: 'desc',
        },
        include: {
          suppliers: {
            select: {
              Id: true,
              Code: true,
            },
          },
          categories: {
            select: {
              Id: true,
              Code: true,
            },
          },
          classifies: {
            select: {
              Id: true,
              Code: true,
            },
          },
        },
      }),
      this.prismaService.products.count({
        where: { CompanyId: companyId },
      }),
    ]);

    return {
      data: products.map((product) => {
        const { suppliers, categories, classifies, ...productData } = product;
        return {
          ...productData,
          supplierCode: suppliers.Code,
          categoryCode: categories.Code,
          classifyCode: classifies.Code,
        };
      }),
      totalRecord: totalCount,
      page,
      limit,
    };
  }

  async searchProduct(
    companyId: number,
    warehouseId?: number,
    categoryId?: number,
    classifyId?: number,
    supplierId?: number,
    name?: string,
    code?: string,
    status?: ProductStatus,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const [product, totalCount] = await this.prismaService.$transaction([
      this.prismaService.products.findMany({
        where: {
          CompanyId: companyId,
          ...(warehouseId && { WarehouseId: Number(warehouseId) }),
          ...(supplierId && { SupplierId: Number(supplierId) }),
          ...(categoryId && { CategoryId: Number(categoryId) }),
          ...(classifyId && { ClassifyId: Number(classifyId) }),
          ...(name && { Name: { contains: name, mode: 'insensitive' } }),
          ...(code && { Code: { contains: code, mode: 'insensitive' } }),
          ...(status && { Status: ProductStatus[status] }),
        },
        orderBy: {
          Id: 'desc',
        },
        include: {
          suppliers: {
            select: {
              Id: true,
              Code: true,
            },
          },
          categories: {
            select: {
              Id: true,
              Code: true,
            },
          },
          classifies: {
            select: {
              Id: true,
              Code: true,
            },
          },
        },
      }),
      this.prismaService.products.count({
        where: {
          CompanyId: companyId,
          ...(warehouseId && { WarehouseId: Number(warehouseId) }),
          ...(supplierId && { SupplierId: Number(supplierId) }),
          ...(categoryId && { CategoryId: Number(categoryId) }),
          ...(classifyId && { ClassifyId: Number(classifyId) }),
          ...(name && { Name: { contains: name, mode: 'insensitive' } }),
          ...(code && { Code: { contains: code, mode: 'insensitive' } }),
          ...(status && { Status: ProductStatus[status] }),
        },
      }),
    ]);

    return {
      data: product.map((product) => {
        const { suppliers, categories, classifies, ...productData } = product;
        return {
          ...productData,
          supplierCode: suppliers.Code,
          categoryCode: categories.Code,
          classifyCode: classifies.Code,
        };
      }),
      totalRecord: totalCount,
      page,
      limit,
    };
  }

  // Get detail product
  async getDetailProduct(id: number, companyId: number) {
    try {
      const result = await this.prismaService.products.findUnique({
        where: {
          Id: id,
          CompanyId: companyId,
        },
        include: {
          suppliers: {
            select: {
              Id: true,
              Code: true,
            },
          },
          categories: {
            select: {
              Id: true,
              Code: true,
            },
          },
          classifies: {
            select: {
              Id: true,
              Code: true,
            },
          },
        },
      });

      return result;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Cannot find product');
    }
  }

  // Get all products in warehouse
  async getAllProductInWarehouse(companyId: number, warehouseId: number) {
    return await this.prismaService.products.findMany({
      where: {
        CompanyId: companyId,
        WarehouseId: warehouseId,
      },
      include: {
        suppliers: {
          select: {
            Id: true,
            Code: true,
          },
        },
        categories: {
          select: {
            Id: true,
            Code: true,
          },
        },
        classifies: {
          select: {
            Id: true,
            Code: true,
          },
        },
      },
    });
  }

  // Search product in warehouse
  async searchProductInWarehouse(
    companyId: number,
    warehouseId: number,
    supplierId: number,
    categoryId?: number,
    classifyId?: number,
    name?: string,
    code?: string,
    isRestock?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const [products, totalCount] = await this.prismaService.$transaction([
      this.prismaService.products.findMany({
        where: {
          CompanyId: companyId,
          WarehouseId: warehouseId,
          ...(supplierId && { SupplierId: Number(supplierId) }),
          ...(categoryId && { CategoryId: Number(categoryId) }),
          ...(classifyId && { ClassifyId: Number(classifyId) }),
          ...(name && { Name: { contains: name, mode: 'insensitive' } }),
          ...(code && { Code: { contains: code, mode: 'insensitive' } }),
          ...(isRestock && { IsRestock: JSON.parse(isRestock) }),
        },
        // skip,
        // take: limit,
        orderBy: {
          Id: 'desc',
        },
        include: {
          suppliers: {
            select: {
              Id: true,
              Code: true,
            },
          },
          categories: {
            select: {
              Id: true,
              Code: true,
            },
          },
          classifies: {
            select: {
              Id: true,
              Code: true,
            },
          },
        },
      }),
      this.prismaService.products.count({
        where: {
          CompanyId: companyId,
          WarehouseId: warehouseId,
          ...(supplierId && { SupplierId: Number(supplierId) }),
          ...(categoryId && { CategoryId: Number(categoryId) }),
          ...(classifyId && { ClassifyId: Number(classifyId) }),
          ...(name && { Name: { contains: name, mode: 'insensitive' } }),
          ...(code && { Code: { contains: code, mode: 'insensitive' } }),
          ...(isRestock && { IsRestock: JSON.parse(isRestock) }),
        },
      }),
    ]);
    return {
      data: products.map((product) => {
        const { suppliers, categories, classifies, ...productData } = product;
        return {
          ...productData,
          supplierCode: suppliers.Code,
          categoryCode: categories.Code,
          classifyCode: classifies.Code,
        };
      }),
      totalRecord: totalCount,
      page,
      limit,
    };
  }

  // Create new product
  async createProduct(companyId: number, productInfo: InsertProduct) {
    const checkAvilable = await this.prismaService.products.findFirst({
      where: {
        CompanyId: companyId,
        Code: productInfo.code,
        WarehouseId: productInfo.warehouseId,
      }
    });

    if (checkAvilable) {
      throw new ForbiddenException('Product already exists');
    } else {
      return await this.prismaService.products.create({
        data: {
          Code: productInfo.code,
          Name: productInfo.name,
          CategoryId: Number(productInfo.categoryId),
          ClassifyId: Number(productInfo.classifyId),
          SupplierId: Number(productInfo.supplierId),
          WarehouseId: Number(productInfo.warehouseId),
          Size: productInfo.size || null,
          Material: productInfo.material || null,
          Color: productInfo.color || null,
          Design: productInfo.design || null,
          Describe: productInfo.describe || null,
          CompanyId: companyId,
        },
      });
    }
  }

  async updateProduct(
    companyId: number,
    id: number,
    productInfo: UpdateProduct,
  ) {
    const checkAvilable = await this.prismaService.products.findFirst({
      where: {
        Id: Number(id),
        CompanyId: companyId,
        WarehouseId: Number(productInfo.warehouseId),
      },
    });

    if (!checkAvilable) {
      throw new ForbiddenException('Product not exists');
    }

    return await this.prismaService.products.update({
      data: {
        Name: productInfo.name,
        CategoryId: Number(productInfo.categoryId),
        ClassifyId: Number(productInfo.classifyId),
        SupplierId: Number(productInfo.supplierId),
        WarehouseId: Number(productInfo.warehouseId),
        Size: productInfo.size,
        Material: productInfo.material,
        Color: productInfo.color,
        Design: productInfo.design,
        Describe: productInfo.describe,
        Status: productInfo.status,
      },
      where: {
        Id: Number(id),
        CompanyId: companyId,
        WarehouseId: productInfo.warehouseId,
      },
    });
  }

  async deleteProducts(ids: number[], companyId: number) {
    try {
      await this.prismaService.products.updateMany({
        where: {
          Id: { in: ids },
          CompanyId: companyId,
        },
        data: {
          Status: 'DEACTIVE',
        },
      });

      return {
        message: 'Delete product/products successfully',
      };
    } catch (error) {
      throw new ForbiddenException('Cannot delete product/products');
    } finally {
      setTimeout(async () => {
        try {
          await this.prismaService.products.deleteMany({
            where: {
              Id: { in: ids },
              Quantity: 0,
            },
          });

          const stockMap = await this.checkStock(companyId, ids);
          for (const productId of ids) {
            if (!stockMap[productId]) {
              await this.prismaService.products.delete({
                where: { Id: productId },
              });
            }
          }
        } catch (error) {
          console.log(error);
        }
      }, 0);
    }
  }

  async checkStock(companyId: number, productIds: number[]) {
    const results = await this.prismaService.products.findMany({
      where: {
        CompanyId: companyId,
        Id: { in: productIds },
        Quantity: { gt: 0 }
      },
      select: {
        Id: true,
      }
    });

    const stockMap = productIds.reduce((acc, id) => {
      acc[id] = false;
      return acc;
    }, {} as { [key: number]: boolean });

    results.forEach(result => {
      stockMap[result.Id] = true;
    });

    return stockMap;
  }  
}
