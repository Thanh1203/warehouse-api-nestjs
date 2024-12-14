import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InsertSupplier, UpdateSupplier } from './dto';
import { checkStock } from '@/helpers';

@Injectable()
export class SuppliersService {
  constructor(private prismaService: PrismaService) {}

  async getSupplier(companyId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [suppliers, totalCount] = await this.prismaService.$transaction([
      this.prismaService.suppliers.findMany({
        where: { CompanyId: companyId },
        // skip,
        // take: limit,
      }),
      this.prismaService.suppliers.count({
        where: { CompanyId: companyId}
      })
    ]);
    return {
      data: suppliers,
      totalRecord: totalCount,
      // page,
      // limit,
    }
  }

  async searchSupplier(companyId: number, name: string, isCollab: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [suppliers, totalCount] = await this.prismaService.$transaction([
      this.prismaService.suppliers.findMany({
        where: {
          CompanyId: companyId,
          ...(isCollab && {IsCollab: JSON.parse(isCollab)}),
          Name: {
            contains: name,
            mode: 'insensitive',
          }
        },
        // skip,
        // take: limit,
      }),
      this.prismaService.suppliers.count({
        where: {
          CompanyId: companyId,
          ...(isCollab && {IsCollab: JSON.parse(isCollab)}),
          Name: {
            contains: name,
            mode: 'insensitive',
          }
        }
      })
    ]);
    return {
      data: suppliers,
      totalRecord: totalCount,
      // page,
      // limit,
    }
  }


  async createSupplier(companyId: number, supplierInfo: InsertSupplier) {
    const checkCodeSup = await this.prismaService.suppliers.findUnique({ where: { CompanyId: companyId, Code: supplierInfo.code } });
    
    if (checkCodeSup) {
     throw new ForbiddenException('Supplier code already exists');    
    } else {
      return await this.prismaService.suppliers.create({
        data: {
          Code: supplierInfo.code,
          Name: supplierInfo.name,
          Origin: supplierInfo.origin,
          CompanyId: companyId,
          IsCollab: true
        }
      });
    }
  }


  async updateSupplier(companyId: number, supplierId: number, supplierInfo: UpdateSupplier) {
    const supplierUpdate = await this.prismaService.suppliers.findUnique({ where: {CompanyId: companyId,  Id: supplierId } });

    if (!supplierUpdate) {
      throw new ForbiddenException('Cannot find supplier');    
    }

    return await this.prismaService.suppliers.update({
      where: { Id: supplierId },
      data: {
        Name: supplierInfo.name,
        Origin: supplierInfo.origin,
        IsCollab: supplierInfo.isCollab
      }
    })
  }

  async deleteSupplier(supplierIds: number[], companyId: number): Promise<{ message: string }> {
    const ids = Array.isArray(supplierIds) ? supplierIds : [supplierIds];
    try {
      await this.prismaService.suppliers.updateMany({
        where: { Id: { in: ids } },
        data: { IsCollab: false },
      });

      return {
        message: 'Delete suppliers successfully',
      };
    } catch (error) {
      throw new ForbiddenException('Failed to delete suppliers');
    } finally {
      setTimeout(async () => {
        try {
          await this.prismaService.products.deleteMany({ where: { SupplierId: { in: ids }, inventory_items: { every: { Quantity: 0 } } } });
          await this.prismaService.classifies.deleteMany({ where: { SupplierId: { in: ids }, product: { none: {} } } });
          await this.prismaService.categories.deleteMany({ where: { SupplierId: { in: ids }, classifies: { none: {} } } });

          const stockMap = await this.checkStock(companyId, ids);
          for (const supplierId of ids) {
            if (!stockMap[supplierId]) {
              const supplierExists = await this.prismaService.suppliers.findUnique({ where: { Id: supplierId } });
              if (supplierExists) {
                await this.prismaService.suppliers.delete({
                  where: { Id: supplierId }
                });
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      }, 0);
    }
  }

  async checkStock(companyId: number, supplierIds: number[]): Promise<{ [key: number]: boolean }> {
    const results = await this.prismaService.products.findMany({
      where: {
        CompanyId: companyId,
        SupplierId: { in: supplierIds },
        inventory_items: { some: { Quantity: { gt: 0 } } },
      },
      select: {
        SupplierId: true,
      },
    });

    const stockMap = supplierIds.reduce((acc, id) => {
      acc[id] = false;
      return acc;
    }, {} as { [key: number]: boolean });

    results.forEach(result => {
      stockMap[result.SupplierId] = true;
    });

    return stockMap;
  }
}
