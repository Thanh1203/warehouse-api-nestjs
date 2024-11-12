import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InsertSupplier, UpdateSupplier } from './dto';
import { checkStock } from '@/helpers';

@Injectable()
export class SuppliersService {
  constructor(private prismaService: PrismaService) {}

  async getSupplier(companyId: number) {
    return await this.prismaService.suppliers.findMany({ where: { CompanyId: companyId, IsCollab: true} });
  }

  async searchSupplier(companyId: number, name: string) {
    return await this.prismaService.suppliers.findMany({
      where: {
        CompanyId: companyId,
        IsCollab: true,
        Name: {
          contains: name,
          mode: 'insensitive',
        }
      }
    });
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


  async updateSupplier(supplierId: number, supplierInfo: UpdateSupplier) {
    const supplierUpdate = await this.prismaService.suppliers.findUnique({ where: { Id: supplierId, IsCollab: true } });

    if (!supplierUpdate) {
      throw new ForbiddenException('Cannot find supplier');    
    }

    return await this.prismaService.suppliers.update({
      where: { Id: supplierId },
      data: {
        Name: supplierInfo.name,
        Origin: supplierInfo.origin
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

          const stockMap = await checkStock(companyId, ids);
          for (const supplierId of ids) {
            if (!stockMap[supplierId]) {
              await this.prismaService.suppliers.delete({
                where: { Id: supplierId }
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
