import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { AtGuard } from '../auth/common/guards';
import { GetUserInfor } from '../auth/common/decorators';
import { InsertInvoice } from './dto';
import { ParseIntArrayPipe } from '@/pipes';

@UseGuards(AtGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) { }
  
  @Get()
  async getInvoices(
    @GetUserInfor('companyId') companyId: number,
  ) { 
    return await this.invoicesService.getInvoices(companyId);
  }

  @Get(':id')
  async getDetailInvoice(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number
  ) {
    return await this.invoicesService.getDetailInvoice(companyId, id);
  }

  @Get('search')
  async searchInvoice(
    @GetUserInfor('companyId') companyId: number,
    @Query('code') code?: string,
    @Query('date') date?: Date,
    @Query('phone') phone?: string,
  ) { 
    return await this.invoicesService.searchInvoice(companyId, code, date, phone);
  }

  @Post()
  async createInvoice(
    @GetUserInfor('companyId') companyId: number,
    @Body() dto: InsertInvoice
  ) { 
    return await this.invoicesService.createInvoice(companyId, dto);
  }

  @Delete()
  async deleteInvoice(
    @GetUserInfor('companyId') companyId: number,
    @Query('ids') warehouseId: number,
    @Body('ids',new ParseIntArrayPipe('ids')) ids: number[]
  ) { 
    return await this.invoicesService.deleteInvoices(companyId, warehouseId, ids);
  }
}
