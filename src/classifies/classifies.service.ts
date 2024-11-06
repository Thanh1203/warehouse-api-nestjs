import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InsertClassify } from './dto/insert.classify.dto';
import { UpdateClassify } from './dto/update.classify.dto';

@Injectable()
export class ClassifiesService {
  constructor(private prisnaService: PrismaService) { }
  
  async getClassifies(companyId: number) {
    return await this.prisnaService.classifies.findMany({
      where: { CompanyId: companyId },
    });
  }

  async searchClassifies(companyId: number, warehouseId?: number, categoryId?:number ,supplierId?: number, name?: string) {
    return await this.prisnaService.classifies.findMany({
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
    const checkCodeClass = await this.prisnaService.classifies.findUnique({ where: { Code: classifyInfo.code, CompanyId: companyId } });

    if (checkCodeClass) {
      throw new ForbiddenException('Classify code already exists');
    } else {
      return await this.prisnaService.classifies.create({
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
    const classifyUpdate = await this.prisnaService.classifies.findUnique({ where: { Id: classifyId, CompanyId: companyId } });

    if (!classifyUpdate) {
      throw new ForbiddenException('Cannot find classify');
    }

    return await this.prisnaService.classifies.update({
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
      await this.prisnaService.classifies.updateMany({
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
          await this.prisnaService.products.deleteMany({ where: { ClassifyId: { in: ids }, quantity: 0 } });
          
          const stockMap = await this.checkStock(companyId, ids);
          for (const classifyId of ids) {
            if (!stockMap[classifyId]) {
              await this.prisnaService.classifies.delete({
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

  async checkStock(companyId: number, classifiesId: number[]): Promise<{ [key: number]: boolean }> {
    const results = await this.prisnaService.products.findMany({
      where: {
        CompanyId: companyId,
        ClassifyId: { in: classifiesId },
        quantity: { gt: 0 },
      },
      select: {
        ClassifyId: true
      }
    });

    const stockMap = classifiesId.reduce((acc, id) => {
      acc[id] = false;
      return acc;
    }, {} as { [key: number]: boolean });

    results.forEach(result => {
      stockMap[result.ClassifyId] = true;
    });

    return stockMap;
  }
}