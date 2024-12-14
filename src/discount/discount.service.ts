import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DiscountQuery } from './types';
import { InsertDiscountOfferDto, UpdateDiscountOfferDto } from './dto';

@Injectable()
export class DiscountService {
  constructor(private prismaService: PrismaService) { }

  async getAllDiscount(companyId: number, page: number = 1, limit: number = 10) { 
    const skip = (page - 1) * limit;
    const result = await this.prismaService.discountOffers.aggregate({
      _count: {
        _all: true,
      },
      where: {
        CompanyId: companyId,
      },
      skip,
      take: limit,
      orderBy: {
        CreateAt: 'desc',
      }
    });

    return {
      data: result,
      totalRecord: result._count._all,
      page,
      limit,
    }
  }

  async searchDiscount(companyId: number, page: number = 1, limit: number = 10, query: Record<string,  any>) { 
    const skip = (page - 1) * limit;
    const { code, name, discount, startDate, endDate, type } = query as DiscountQuery;
    return await this.prismaService.discountOffers.aggregate({
      _count: {
        Id: true,
      },
      where: {
        CompanyId: companyId,
        ...(code && { Code: { contains: code, mode: 'insensitive' } }),
        ...(name && { Name: { contains: name, mode: 'insensitive' } }),
        ...(discount && { Discount: discount }),
        ...(startDate && { StartDate: startDate }),
        ...(endDate && { EndDate: endDate }),
        ...(type && { Type: type }),
      },
      skip,
      take: limit,
      orderBy: {
        CreateAt: 'desc',
      },
    });
  }

  async getDiscountById(companyId: number, id: number) { 
    return await this.prismaService.discountOffers.findUnique({
      where: {
        Id: id,
        CompanyId: companyId,
      }
    })
  }

  async getDiscountByCustomer(companyId: number, customerId: number) {
    const today = new Date();
    return await this.prismaService.customers.findUnique({
      where: {
        CompanyId: companyId,
        Id: customerId,
      },
      select: {
        discounts: {
          where: {
            CompanyId: companyId,
            EndDate: {
              gte: today,
            }
          },
          select: {
            Code: true,
            Name: true,
            Description: true,
            Discount: true,
            StartDate: true,
            EndDate: true,
            Type: true,
          },
        }
      }
    });
  }

  async createDiscount(companyId: number, dto: InsertDiscountOfferDto) { 
    const { discountForCustomer, ...discount } = dto;
    const newDiscount = await this.prismaService.discountOffers.create({
      data: {
        Code: discount.code,
        Name: discount.name,
        Description: discount.description,
        Discount: discount.discount,
        StartDate: discount.startDate,
        EndDate: discount.endDate,
        Type: discount.type,
        CompanyId: companyId,
        discountCustomers: discountForCustomer ? {
          create: discountForCustomer.map(item => {
            return {
              customers: {
                connect: { Id: item.customerId }
              },
              discountId: item.discountId,
            }
          })
        } : undefined,
      }
    })

    return newDiscount;
  }

  async updateDiscount(companyId: number, id: number, dto: UpdateDiscountOfferDto) { 
    const existingDiscount = await this.prismaService.discountOffers.findUnique({
      where: {
        Id: id,
        CompanyId: companyId,
      }
    });

    if (!existingDiscount) throw new NotFoundException('Discount not found');

    const updatedDiscount = await this.prismaService.discountOffers.update({
      where: {
        Id: id,
        CompanyId: companyId,
      },
      data: {
        ...(dto.name && { Name: dto.name }),
        ...(dto.description && { Description: dto.description }),
        ...(dto.discount && { Discount: dto.discount }),
        ...(dto.type && { Type: dto.type })
      }
    });
    
    return updatedDiscount;
  }
  
  async deleteDiscount(companyId: number, ids: number[]): Promise<{message: string}> { 
    try {
      await this.prismaService.$transaction([
        this.prismaService.customerDiscounts.deleteMany({
          where: {
            DiscountId: {
              in: ids,
            }
          }
        }),
        this.prismaService.discountOffers.deleteMany({
          where: {
            Id: {
              in: ids,
            },
            CompanyId: companyId,
          }
        })
      ])

      return { message: 'Delete discount/discounts successfully' };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Failed to delete discount/disconsts');
    }
  }
}
