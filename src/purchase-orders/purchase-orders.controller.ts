import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { AtGuard } from '../auth/common/guards';
import { GetUserInfor } from '../auth/common/decorators';
import { ParseIntArrayPipe } from '@/pipes';
import { InsertPurchaseOrder, InsertPurchaseReturnDetail, UpdatePurchaseOrder, UpdatePurchaseOrderDetail } from './dto';
import { PurchaseOrderStatus } from '@prisma/client';

@UseGuards(AtGuard)
@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) { }
  
  @Get()
  async getAllPurchasesOrders(
    @GetUserInfor('companyId') companyId: number,
  ) { 
    return this.purchaseOrdersService.getAllPurchasesOrders(companyId);
  }
  
  @Get(':id')
  async getDetailPurchaseOrder(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number
  ) { 
    return this.purchaseOrdersService.getDetailPurchaseOrder(companyId, id);
  }

  @Get('search')
  async searchPurchaseOrder(
    @GetUserInfor('companyId') companyId: number,
    @Query('code') code: string,
    @Query('date') date: Date,
    @Query('status') status: PurchaseOrderStatus,
    @Query('warehouseIds', new ParseIntArrayPipe('warehouseIdsv')) warehouseIds: number[],
    @Query('supplierIds', new ParseIntArrayPipe('supplierIds')) supplierIds: number[],
    @Query('staffIds', new ParseIntArrayPipe('staffIds')) staffIds: number[],
  ) {
    return await this.purchaseOrdersService.searchPurchaseOrders(companyId, status, code, warehouseIds, date, supplierIds, staffIds);
  }

  @Post()
  async createPurchaseOrder(
    @GetUserInfor('companyId') companyId: number,
    @Body() dto: InsertPurchaseOrder
  ) { 
    return await this.purchaseOrdersService.createPurchaseOrder(companyId, dto);
  }

  @Post('refund/:id')
  async createPurchaseReturn(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number,
    @Body() dto: InsertPurchaseReturnDetail,
  ) {
    return await this.purchaseOrdersService.createPurchaseReturn(companyId, id, dto);
  }
    
  @Patch(':id')
  async updatePurchaseOrder(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number,
    @Body() dto: UpdatePurchaseOrder
  ) { 
    return await this.purchaseOrdersService.updatePurchaseOrder(companyId, id, dto);
  }

  @Patch('detail/:id')
  async updatePurchaseOrderDetail(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number,
    @Body() dto: UpdatePurchaseOrderDetail[]
  ) { 
    return await this.purchaseOrdersService.updatePurchaseOrderDetail(companyId, id, dto);
  }

  @Delete()
  async deletePurchaseOrder(
    @GetUserInfor('companyId') companyId: number,
    @Body('ids', new ParseIntArrayPipe('ids')) ids: number[]
  ) { 
    return await this.purchaseOrdersService.deletePurchaseOrder(companyId, ids);
  }
}
