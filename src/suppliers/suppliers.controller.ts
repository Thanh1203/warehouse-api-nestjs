import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { AtGuard } from 'src/auth/common/guards';
import { GetUserInfor } from 'src/auth/common/decorators';
import { InsertSupplier, UpdateSupplier } from './dto';

@UseGuards(AtGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) { }
  
  @Get()
  getSupplier(
    @GetUserInfor('companyId') companyId: number,
    @Query('name') name?: string
  ) {
    if (!name) {
      return this.suppliersService.getSupplier(companyId);
    } else {
      return this.suppliersService.searchSupplier(companyId, name);
    }
  }

  @Post()
  createSupplier(
    @GetUserInfor('companyId') companyId: number,
    @Body() dto: InsertSupplier
  ) {
    return this.suppliersService.createSupplier(companyId, dto);
  }

  @Patch(':id')
  updateSupplier(
    @Param('id', ParseIntPipe) supplierId: number,
    @Body() dto: UpdateSupplier
  ) { 
    return this.suppliersService.updateSupplier(supplierId, dto);
  }

  @Delete(':id')
  deleteSupplier(
    @Param('id', ParseIntPipe) supplierId: number,
    @GetUserInfor('companyId') companyId: number,
  ) {
    return this.suppliersService.deleteSupplier(supplierId, companyId);
  }
}
