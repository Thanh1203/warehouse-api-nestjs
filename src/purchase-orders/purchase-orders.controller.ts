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
    @Query('code') code?: string,
    @Query('supplierId') supplierId?: string,
    @Query('staffId') staffId?: string,
    @Query('createAt') createAt?: Date,
    @Query('status') status?: string,
    @Query('warehouseId') warehouseId?: string,
  ) { 
    if (code || supplierId || staffId || status || createAt || warehouseId) {
      return this.purchaseOrdersService.searchPurchaseOrders(companyId, code, supplierId, staffId, createAt, status, warehouseId);
    } else {
      return this.purchaseOrdersService.getAllPurchasesOrders(companyId);
    }
  }
  
  @Get(':id')
  async getDetailPurchaseOrder(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number
  ) { 
    return this.purchaseOrdersService.getDetailPurchaseOrder(companyId, id);
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
