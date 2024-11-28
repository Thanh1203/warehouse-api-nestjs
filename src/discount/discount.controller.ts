import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { AtGuard } from '../auth/common/guards';
import { GetUserInfor } from '../auth/common/decorators';
import { InsertDiscountOfferDto } from './dto';
import { ParseIntArrayPipe } from '@/pipes';

@UseGuards(AtGuard)
@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) { }
  
  @Get()
  async getAllDiscount(
    @GetUserInfor('companyId') companyId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('query') query: Record<string, any>,
  ) {
    if (Object.keys(query).length === 0) {
      return await this.discountService.getAllDiscount(companyId, page, limit);
    } else {
      return await this.discountService.searchDiscount(companyId, page, limit, query);
    }
  }
  
  @Get('detail/:id')
  async getDiscountById(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number
  ) { 
    return await this.discountService.getDiscountById(companyId, id);
  }

  @Get('customer/:id')
  async getDiscountByCustomer(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number
  ) { 
    return await this.discountService.getDiscountByCustomer(companyId, id);
  }

  @Post()
  async createDiscount(
    @GetUserInfor('companyId') companyId: number,
    @Body() dto: InsertDiscountOfferDto
  ) { 
    return await this.discountService.createDiscount(companyId, dto);
  }

  @Patch(':id')
  async updateDiscount(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number,
    @Body() dto: InsertDiscountOfferDto
  ) { 
    return await this.discountService.updateDiscount(companyId, id, dto);
  }

  @Delete()
  async deleteDiscounts(
    @GetUserInfor('companyId') companyId: number,
    @Body('ids', ParseIntArrayPipe) ids: number[]
  ) { }
}
