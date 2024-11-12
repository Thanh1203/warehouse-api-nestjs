import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InsertClassify } from './dto/insert.classify.dto';
import { UpdateClassify } from './dto/update.classify.dto';
import { checkStock } from '@/helpers';

@Injectable()
export class ClassifiesService {
  constructor(private prismaService: PrismaService) { }
  
  async getClassifies(companyId: number) {
    return await this.prismaService.classifies.findMany({
      where: { CompanyId: companyId },
    });
  }

  async searchClassifies(companyId: number, warehouseId?: number, categoryId?:number ,supplierId?: number, name?: string) {
    return await this.prismaService.classifies.findMany({
      where: {
        CompanyId: companyId,
        ...(warehouseId && { WarehouseId: Number(warehouseId) }),
        ...(supplierId && { SupplierId: Number(supplierId) }),
        ...(categoryId && { CategoryId: Number(categoryId) }),
        ...(name && {
          Name: {
            contains: name,
            mode: 'insensitive',
          }
        })
      }
    });
  }

  async createClassify(companyId: number, classifyInfo: InsertClassify) {
    const checkCodeClass = await this.prismaService.classifies.findUnique({ where: { Code: classifyInfo.code, CompanyId: companyId } });

    if (checkCodeClass) {
      throw new ForbiddenException('Classify code already exists');
    } else {
      return await this.prismaService.classifies.create({
        data: {
          Code: classifyInfo.code,
          Name: classifyInfo.name,
          WarehouseId: Number(classifyInfo.warehouseId),
          SupplierId: Number(classifyInfo.supplierId),
          CategoryId: Number(classifyInfo.categoryId),
          CompanyId: companyId,
          IsRestock: true
        }
      });
    }
  }

  async updateClassify(companyId: number, classifyInfo: UpdateClassify, classifyId: number) {
    const classifyUpdate = await this.prismaService.classifies.findUnique({ where: { Id: classifyId, CompanyId: companyId } });

    if (!classifyUpdate) {
      throw new ForbiddenException('Cannot find classify');
    }

    return await this.prismaService.classifies.update({
      where: { Id: classifyId, CompanyId: companyId },
      data: {
      Name: classifyInfo.name,
      CategoryId: Number(classifyInfo.categoryId),
      SupplierId: Number(classifyInfo.supplierId),
      WarehouseId: Number(classifyInfo.warehouseId),
      IsRestock: classifyInfo.isRestock
      }
    });
  }

  async deleteClassify(classifiesId: number | number[], companyId: number): Promise<{ message: string }> {
    const ids = Array.isArray(classifiesId) ? classifiesId : [classifiesId];

    try {
      await this.prismaService.classifies.updateMany({
        where: { Id: { in: ids }, CompanyId: companyId },
        data: { IsRestock: false }
      });

      return {
        message: 'Delete classify/classifies successfully',
      }
    } catch (error) {
      throw new ForbiddenException('Cannot delete classify/classifies');
    } finally {
      setTimeout(async () => {
        try {
          await this.prismaService.products.deleteMany({ where: { ClassifyId: { in: ids }, inventory_items: { every: { Quantity: 0 } } } });
          
          const stockMap = await checkStock(companyId, ids);
          for (const classifyId of ids) {
            if (!stockMap[classifyId]) {
              await this.prismaService.classifies.delete({
                where: { Id: classifyId }
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