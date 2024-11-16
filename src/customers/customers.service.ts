import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prismaService: PrismaService) { }
  
  async getAllCustomers(companyId: number) {
    return await this.prismaService.customers.findMany({
      where: {
        CompanyId: companyId,
      }
    })
  }

  async getAllCustomerByWarehouse(companyId: number, warehouseId: number) {
    return await this.prismaService.customers.findMany({
      where: {
        WarehouseId: warehouseId
      }
    })  
  }

  async getDetailCustomer(companyId: number, id: number) {
    return await this.prismaService.customers.findUnique({
      where: {
        Id: id,
        CompanyId: companyId
      }
    })
  }

  
}
