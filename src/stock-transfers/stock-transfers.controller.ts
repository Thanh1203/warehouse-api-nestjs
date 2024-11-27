import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { StockTransfersService } from './stock-transfers.service';
import { AtGuard } from '../auth/common/guards';
import { GetUserInfor } from '../auth/common/decorators';
import { StockTransferStatus } from '@prisma/client';
import { TransfersQuery } from './types';
import { InsertStockTransfersDto, UpdateStockTransfersDto } from './dto';
import { ParseIntArrayPipe } from '@/pipes';

@UseGuards(AtGuard)
@Controller('stock-transfers')
export class StockTransfersController {
  constructor(private readonly stockTransfersService: StockTransfersService) { }
  
  @Get()
  async getAllStockTransfers(
    @GetUserInfor('companyId') companyId: number,
    @Query() query?: Record<string, TransfersQuery>
  ) {
    if (Object.keys(query).length === 0) {
      return await this.stockTransfersService.getAllStockTransfers(companyId);
    } else {
      return await this.stockTransfersService.searchStockTransfers(companyId, query);
    }
  }

  @Get(':id')
  async getDetailStockTransfer(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number
  ) { 
    return await this.stockTransfersService.getDetailStockTransfer(companyId, id);
  }

  @Post()
  async createStockTransfer(
    @GetUserInfor('companyId') companyId: number,
    @Body() dto: InsertStockTransfersDto
  ) { 
    return await this.stockTransfersService.createStockTransfer(companyId, dto);
  }

  @Patch(':id')
  async updateStockTransfer(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number,
    @Body() dto: UpdateStockTransfersDto
  ) { }

  @Patch('detail/:id')
  async updateStockTransferDetail(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number,
  ) { }

  @Delete()
  async deleteStockTransfers(
    @GetUserInfor('companyId') companyId: number,
    @Query('ids', ParseIntArrayPipe) ids: number[],
  ) { }
}
