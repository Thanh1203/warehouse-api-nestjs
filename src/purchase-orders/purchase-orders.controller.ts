import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { AtGuard } from '../auth/common/guards';
import { GetUserInfor } from '../auth/common/decorators';
import { ParseIntArrayPipe } from '@/pipes';
import { InsertPurchaseOrder, UpdatePurchaseOrder } from './dto';

@UseGuards(AtGuard)
@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) { }
  
  @Get()
  async getAllPurchasesOrders(
    @GetUserInfor('companyId') companyId: number,
    @Query('warehouseIds', ParseIntArrayPipe) warehouseIds?: number[],
  ) { 
    if (warehouseIds.length > 0) {
      
    } else {

    }
  }
  
  @Get(':id')
  async getDetailPurchaseOrder(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number
  ) { 

  }

  @Post()
  async createPurchaseOrder(
    @GetUserInfor('companyId') companyId: number,
    @Body() dto: InsertPurchaseOrder
  ) { }

  @Patch(':id')
  async updatePurchaseOrder(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number,
    @Body() dto: UpdatePurchaseOrder
  ) { }

  @Delete(':id')
  async deletePurchaseOrder(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number
  ) { }
}
