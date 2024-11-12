import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InsertWarehouse, UpdateWarehouse } from './dto';

@Injectable()
export class WarehousesService {
  constructor(private prismaService: PrismaService) { }
  
  async gethWarehouses(companyId: number) {
    const warehouses = await this.prismaService.warehouses.findMany({ where: { CompanyId: companyId } });
    return warehouses;
  }

  async searchWarehouse(companyId: number, name: string) {
    const warehouses = await this.prismaService.warehouses.findMany({
      where: {
        CompanyId: companyId,
        Name: {
          contains: name,
          mode: 'insensitive',
        }
      }
    })

    return warehouses;
  }

  async createWarehouse(companyId: number, whInfo: InsertWarehouse) {
    const newWh = await this.prismaService.warehouses.create({
      data: {
        Code: whInfo.code,
        Name: whInfo.name,
        Address: whInfo.address,
        StaffId: Number(whInfo.staffId),
        StaffName: whInfo.staffName,
        CompanyId: companyId,
      }
    })

    return newWh;
  }

  async updateWarehouse(warehouseId: number, whInfo: UpdateWarehouse) {
    const whUpdate = await this.prismaService.warehouses.findUnique({
      where: {Id: warehouseId}
    })

    if (!whUpdate) {
      throw new ForbiddenException('Cannot find warehouse');    
    }

    return await this.prismaService.warehouses.update({
      where: { Id: warehouseId },
      data: {
        Name: whInfo.name,
        Address: whInfo.address,
        StaffId: Number(whInfo.staffId),
        StaffName: whInfo.staffName,
      }
    })
  }

  async deleteWarehouse(warehouseId: number) {
    const whDelete = await this.prismaService.warehouses.findUnique({
      where: {Id: warehouseId}
    })

    if (!whDelete) {
      throw new ForbiddenException('Cannot find warehouse');    
    }

    const checkProductInWh = await this.prismaService.inventory_Items.findFirst({
      where: {WarehouseId: warehouseId, Quantity: 0}
    })

    if (!checkProductInWh) {
      throw new ForbiddenException('Still in stock')
    }

    try {
      await this.prismaService.inventory_Items.deleteMany({ where: { WarehouseId: warehouseId } });
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
