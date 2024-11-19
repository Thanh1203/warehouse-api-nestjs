import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InsertInvoice } from './dto';

@Injectable()
export class InvoicesService {
  constructor(private prismaService: PrismaService) {}

  async getInvoices(companyId: number) {
    const result = await this.prismaService.invoices.findMany({
      where: { CompanyId: companyId },
      include: {
        customers: {
          select: {
            Name: true,
          }
        },
        warehouse: {
          select: {
            Name: true,
          }
        },
        staff: {
          select: {
            Name: true,
          }
        }
      }
    });

    return result.map(invoice => {
      const { customers, warehouse, staff, ...invoices } = invoice;
      return {
        ...invoices,
        customerName: customers.Name,
        staffName: staff.Name,
        warehouseName: warehouse.Name,
      }
    });
  }

  async searchInvoice(companyId: number, code?: string, date?: Date, phone?: string) {
    const customers = await this.prismaService.customers.findMany({
      where: {
        CompanyId: companyId,
        Phone: {
          contains: phone,
          mode: 'insensitive',
        },
      }
    })

    const result = await this.prismaService.invoices.findMany({
      where: {
        CompanyId: companyId,
        ...(code ? { Code: code } : {}),
        ...(date ? { Date: date } : {}),
        ...(phone ? { CustomerId: { in: customers.map(c => c.Id) } } : {}),
      },
      include: {
        customers: {
          select: {
            Name: true,
          }
        },
        warehouse: {
          select: {
            Name: true,
          }
        },
        staff: {
          select: {
            Name: true,
          }
        }
      }
    });

    return result.map(invoice => {
      const { customers, warehouse, staff, ...invoices } = invoice;
      return {
        ...invoices,
        customerName: customers.Name,
        staffName: staff.Name,
        warehouseName: warehouse.Name,
      }
    });
  }

  async createInvoice(companyId: number, invoiceInfo: InsertInvoice) {
    const { detail, ...invoiceData } = invoiceInfo;
    const newInvoice = await this.prismaService.invoices.create({
      data: {
        Code: invoiceData.code,
        CustomerId: invoiceData.customerId,
        WarehouseId: invoiceData.warehouseId,
        StaffId: invoiceData.staffId,
        CompanyId: companyId,
        Total: invoiceData.total,
        Discount: invoiceData.discount,
        invoice_details: {
          create: detail.map(d => ({
            ProductId: d.productId,
            Quantity: d.quantity,
            Price: d.price,
            Total: d.total,
          }))
        }
      },
      include: {
        invoice_details: true
      }
    })

    return newInvoice;
  }

  async deleteInvoices(companyId: number, warehouseId, ids) {
    await this.prismaService.$transaction([
      this.prismaService.invoice_Details.deleteMany({
        where: {
          invoices: {
            CompanyId: companyId,
            WarehouseId: warehouseId,
            Id: { in: ids },
          },
        },
      }),
      this.prismaService.invoices.deleteMany({
        where: {
          CompanyId: companyId,
          WarehouseId: warehouseId,
          Id: { in: ids },
        },
      }),
    ]);

    return { message: 'Delete invoices successfully' };
  }

  
}
