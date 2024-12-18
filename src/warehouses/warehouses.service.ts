import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InsertWarehouse, UpdateWarehouse } from './dto';

@Injectable()
export class WarehousesService {
  constructor(private prismaService: PrismaService) { }
  
  async getAllWarehouse(companyId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [warehouses, totalCount] = await this.prismaService.$transaction([
      this.prismaService.warehouses.findMany({
        where: { CompanyId: companyId },
      // skip,
      // take: limit,
      include: {
        staff: {
        select: {
          Name: true,
        }
        }
      }
      }),
      this.prismaService.warehouses.count({
        where: { CompanyId: companyId }
      })
    ]);

    return {
      data: warehouses.map(wh => {
        const { staff, ...warehouse } = wh;
        return {
          ...warehouse,
          staffName: staff.Name
        }
      }),
      totalRecord: totalCount,
      // page,
      // limit,
    }
  }

  async searchWarehouse(companyId: number, name: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [warehouses, totalCount] = await this.prismaService.$transaction([
      this.prismaService.warehouses.findMany({
        where: {
          CompanyId: companyId,
          Name: {
            contains: name,
            mode: 'insensitive',
          },
        },
        // skip,
        // take: limit,
        include: {
          staff: {
            select: {
              Name: true,
            }
          }
        }
      }),
      this.prismaService.warehouses.count({
        where: {
          CompanyId: companyId,
          Name: {
            contains: name,
            mode: 'insensitive',
          },
        }
      })
    ]);

    return {
      data: warehouses.map(wh => {
        const { staff, ...warehouse } = wh;
        return {
          ...warehouse,
          staffName: staff.Name
        }
      }),
      totalRecord: totalCount,
      // page,
      // limit,
    }
  }

  async createWarehouse(companyId: number, whInfo: InsertWarehouse) {
    const newWh = await this.prismaService.warehouses.create({
      data: {
        Code: whInfo.code,
        Name: whInfo.name,
        Address: whInfo.address,
        StaffId: Number(whInfo.staffId),
        CompanyId: companyId,
      }
    })

    return newWh;
  }

  async updateWarehouse(companyId: number, warehouseId: number, whInfo: UpdateWarehouse) {
    await this.prismaService.warehouses.findUnique({
      where: {CompanyId: companyId, Id: warehouseId}
    }).catch((error) => {
      console.log(error);
      throw new ForbiddenException('Cannot find warehouse');    
    })

    return await this.prismaService.warehouses.update({
      where: { Id: warehouseId },
      data: {
        Name: whInfo.name,
        Address: whInfo.address,
        StaffId: Number(whInfo.staffId),
      }
    })
  }

  async deleteWarehouse(companyId: number, warehouseId: number) {
    const whDelete = await this.prismaService.warehouses.findUnique({
      where: {Id: warehouseId}
    })

    if (!whDelete) {
      throw new ForbiddenException('Cannot find warehouse');    
    }

    const checkProductInWh = await this.prismaService.products.findFirst({
      where: { WarehouseId: warehouseId, Quantity: { gt: 0 } }
    })

    if (checkProductInWh) {
      throw new ForbiddenException('Still in stock')
    }

    try {
      await this.prismaService.products.deleteMany({ where: { WarehouseId: warehouseId } });
      await this.prismaService.classifies.deleteMany({ where: { WarehouseId: warehouseId } });
      await this.prismaService.categories.deleteMany({ where: { WarehouseId: warehouseId } });
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Please check stock again')
    }

    return await this.prismaService.warehouses.delete({
      where: {Id: warehouseId}
    })
  }

  
}
