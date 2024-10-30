import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { AtGuard } from 'src/auth/common/guards';
import { GetUserInfor } from 'src/auth/common/decorators';
import { InsertSupplier, UpdateSupplier } from './dto';
import { ParseIntArrayPipe } from 'pipes';

@UseGuards(AtGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) { }
  
  @Get()
  async getSupplier(
    @GetUserInfor('companyId') companyId: number,
    @Query('name') name?: string
  ) {
    if (!name) {
      return await this.suppliersService.getSupplier(companyId);
    } else {
      return await this.suppliersService.searchSupplier(companyId, name);
    }
  }

  @Post()
  async createSupplier(
    @GetUserInfor('companyId') companyId: number,
    @Body() dto: InsertSupplier
  ) {
    return await this.suppliersService.createSupplier(companyId, dto);
  }

  @Patch(':id')
  async updateSupplier(
    @Param('id', ParseIntPipe) supplierId: number,
    @Body() dto: UpdateSupplier
  ) { 
    return await this.suppliersService.updateSupplier(supplierId, dto);
  }

  @Delete()
  async deleteSupplier(
    @Body('supplierIds', ParseIntArrayPipe) supplierIds: number[],
    @GetUserInfor('companyId') companyId: number,
  ): Promise<{ message: string; }> {
    return await this.suppliersService.deleteSupplier(supplierIds, companyId);
  }
}
