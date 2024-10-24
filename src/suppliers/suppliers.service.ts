import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InsertSupplier, UpdateSupplier } from './dto';

@Injectable()
export class SuppliersService {
  constructor(private prismaService: PrismaService) {}

  async getSupplier(companyId: number) {
    return await this.prismaService.suppliers.findMany({ where: { CompanyId: companyId} });
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

  async deleteSupplier(supplierId: number, companyId: number) {
    try {
      await this.prismaService.suppliers.update({
        where: { Id: supplierId },
        data: { IsCollab: false },
      });

      return {
        message: 'Delete successful',
      };
    } catch (error) {
      throw new ForbiddenException('Faild to delete supplier');
    } finally {
      setTimeout(async () => {
        try {
          await this.prismaService.products.deleteMany({ where: { SupplierId: supplierId, quantity: 0 } });
          await this.prismaService.classifies.deleteMany({ where: { SupplierId: supplierId, product: { none: {} } } });
          await this.prismaService.categories.deleteMany({ where: { SupplierId: supplierId, classifies: { none: {} } } });
          if (this.checkStock(companyId, supplierId)) {
            await this.prismaService.suppliers.delete({
              where: { Id: supplierId }
            })
          }
        } catch (error) {
          console.log(error);
        }
      }, 0)
    }
  }

  async checkStock(id1, id2): Promise<boolean> {
    const check = await this.prismaService.products.findFirst({ where: { CompanyId: id1, SupplierId: id2, quantity: { gt: 0 } } });
    if (check) {
      return true;
    } else {
      return false;
    }
  }
}
