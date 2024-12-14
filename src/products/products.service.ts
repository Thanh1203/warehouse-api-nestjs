import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InsertProduct, UpdateProduct } from './dto';
import { checkStock } from '@/helpers';

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
    categoryId?: number,
    classifyId?: number,
    supplierId?: number,
    name?: string,
    code?: string,
    isRestock?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const [product, totalCount] = await this.prismaService.$transaction([
      this.prismaService.products.findMany({
        where: {
          CompanyId: companyId,
          ...(supplierId && { SupplierId: supplierId }),
          ...(categoryId && { CategoryId: categoryId }),
          ...(classifyId && { ClassifyId: classifyId }),
          ...(name && { Name: { contains: name, mode: 'insensitive' } }),
          ...(code && { Code: { contains: code, mode: 'insensitive' } }),
          ...(isRestock && { IsRestock: JSON.parse(isRestock) }),
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
          ...(supplierId && { SupplierId: supplierId }),
          ...(categoryId && { CategoryId: categoryId }),
          ...(classifyId && { ClassifyId: classifyId }),
          ...(name && { Name: { contains: name, mode: 'insensitive' } }),
          ...(code && { Code: { contains: code, mode: 'insensitive' } }),
          ...(isRestock && { IsRestock: JSON.parse(isRestock) }),
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
        inventory_items: { every: { WarehouseId: Number(warehouseId) } },
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
          inventory_items: { every: { WarehouseId: warehouseId } },
          ...(supplierId && { SupplierId: supplierId }),
          ...(categoryId && { CategoryId: categoryId }),
          ...(classifyId && { ClassifyId: classifyId }),
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
          inventory_items: { every: { WarehouseId: warehouseId } },
          ...(supplierId && { SupplierId: supplierId }),
          ...(categoryId && { CategoryId: categoryId }),
          ...(classifyId && { ClassifyId: classifyId }),
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
    const checkAvilable = await this.prismaService.products.findUnique({
      where: {
        CompanyId: companyId,
        Code: productInfo.code,
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
          Size: productInfo.size,
          Material: productInfo.material,
          Color: productInfo.color,
          Design: productInfo.design,
          Describe: productInfo.describe,
          IsRestock: true,
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
    return await this.prismaService.products.update({
      data: {
        Name: productInfo.name,
        CategoryId: Number(productInfo.categoryId),
        ClassifyId: Number(productInfo.classifyId),
        SupplierId: Number(productInfo.supplierId),
        Size: productInfo.size,
        Material: productInfo.material,
        Color: productInfo.color,
        Design: productInfo.design,
        Describe: productInfo.describe,
        IsRestock: productInfo.isRestock,
      },
      where: {
        Id: id,
        CompanyId: companyId,
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
          IsRestock: false,
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
          await this.prismaService.inventory_Items.deleteMany({
            where: {
              ProductId: { in: ids },
              Quantity: 0,
            },
          });

          const stockMap = await checkStock(companyId, ids);
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
}
