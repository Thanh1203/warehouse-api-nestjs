import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InsertCategory, UpdateCategory } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async getCategories(companyId: number) {
    return await this.prismaService.categories.findMany({
      where: { CompanyId: companyId },
    });
  }

  async searchCategories(companyId: number, warehouseId?: number, supplierId?: number, name?: string) {
    return await this.prismaService.categories.findMany({
      where: {
        CompanyId: companyId,
        ...(warehouseId && { WarehouseId: Number(warehouseId) }),
        ...(supplierId && { SupplierId: Number(supplierId) }),
        ...(name && {
          Name: {
            contains: name,
            mode: 'insensitive',
          },
        }),
      },
    });
  }

  async createCategory(companyId: number, cateInfo: InsertCategory) {
    const checkCodeCate = await this.prismaService.categories.findUnique({ where: { Code: cateInfo.code, CompanyId: companyId } });

    if (checkCodeCate) {
      throw new ForbiddenException('Category code already exists');
    } else {
      return await this.prismaService.categories.create({
        data: {
          Code: cateInfo.code,
          Name: cateInfo.name,
          WarehouseId: Number(cateInfo.warehouseId),
          SupplierId: Number(cateInfo.supplierId),
          CompanyId: companyId,
          IsRestock: true,
        }
      });
    }
  }

  async updateCategory(companyId: number, categoryId: number, cateInfo: UpdateCategory) {
    const cateUpdate = await this.prismaService.categories.findUnique({ where: { Id: categoryId, CompanyId: companyId } });

    if (!cateUpdate) {
      throw new ForbiddenException('Cannot find category');
    }

    return await this.prismaService.categories.update({
      where: { Id: categoryId, CompanyId: companyId },
      data: {
        Name: cateInfo.name,
        IsRestock: cateInfo.isRestock,
      }
    });
  }

  async deleteCategory(categoryIds: number | number[], companyId: number): Promise<{ message: string }> {
    const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds];

    try {
      await this.prismaService.categories.updateMany({
        where: { Id: { in: ids }, CompanyId: companyId },
        data: { IsRestock: false },
      });

      return {
        message: 'Delete category/categories successfully',
      };
    } catch (error) {
      throw new ForbiddenException('Cannot delete category/categories');
    } finally {
      setTimeout(async () => {
        try {
          await this.prismaService.products.deleteMany({ where: { CategoryId: { in: ids }, quantity: 0 } });
          await this.prismaService.classifies.deleteMany({ where: { CategoryId: { in: ids }, product: { none: {} } } });

          const stockMap = await this.checkStock(companyId, ids);
          for (const categoryId of ids) {
            if (!stockMap[categoryId]) {
              await this.prismaService.categories.delete({
                where: { Id: categoryId }
              });
            }
          }
        } catch (error) {
          console.log(error);
        }
      }, 0);
    }
  }

  async checkStock(companyId: number, categoryIds: number[]): Promise<{ [key: number]: boolean }> {
    const results = await this.prismaService.products.findMany({
      where: {
        CompanyId: companyId,
        CategoryId: { in: categoryIds },
        quantity: { gt: 0 },
      },
      select: {
        CategoryId: true,
      },
    });

    const stockMap = categoryIds.reduce((acc, id) => {
      acc[id] = false;
      return acc;
    }, {} as { [key: number]: boolean });

    results.forEach(result => {
      stockMap[result.CategoryId] = true;
    });

    return stockMap;
  }
}
