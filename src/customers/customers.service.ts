import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InsertCustomer } from './dto/insert.customer';
import { UpdateCustomer } from './dto/update.customer';

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

  async searchCustomer(companyId: number, keyword: string) {
    const isNumber = /^\d+$/.test(keyword);
    return this.prismaService.customers.findMany({
      where: {
        CompanyId: companyId,
        ...(isNumber ? { Phone: keyword } : { Name: { contains: keyword } }),
      },
    });
   }

  async createCustomer(companyId: number, customerInfo: InsertCustomer) {
    return await this.prismaService.customers.create({
      data: {
        Name: customerInfo.name,
        Phone: customerInfo.phone,
        Address: customerInfo.address,
        Email: customerInfo.email,
        CompanyId: companyId,
        WarehouseId: customerInfo.warehouseId
      }
    })
  }
  
  async updateCustomer(companyId: number, id: number, customerInfo: UpdateCustomer) { 
    return await this.prismaService.customers.update({
      where: {
        Id: id,
        CompanyId: companyId
      },
      data: {
        Name: customerInfo.name,
        Phone: customerInfo.phone,
        Address: customerInfo.address,
        Email: customerInfo.email,
      }
    })
  }

  async deleteCustomers(companyId: number, ids: number[]): Promise<{ message: string }> {
    try {
      await this.prismaService.$transaction([
        this.prismaService.invoice_Details.deleteMany({
          where: {
            invoices: {
              CustomerId: { in: ids },
            },
          },
        }),
        this.prismaService.invoices.deleteMany({
          where: {
            CustomerId: { in: ids },
          },
        }),
        this.prismaService.customers.deleteMany({
          where: {
            Id: { in: ids },
            CompanyId: companyId,
          },
        }),
      ]);

      return {
        message: 'Delete customers successfully'
      }
    } catch (error) {
      throw new ForbiddenException('Cannot delete customers');
      
    }
  }
}
