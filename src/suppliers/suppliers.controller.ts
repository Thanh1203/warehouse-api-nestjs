import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseArrayPipe, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('name') name?: string,
    @Query('isCollab') isCollab?: string,
  ) {
    if (!name && !isCollab) {
      return await this.suppliersService.getSupplier(companyId, page, limit);
    } else {
      return await this.suppliersService.searchSupplier(companyId, name, isCollab, page, limit);
    }
  }

  @Post()
  async createSupplier(
    @GetUserInfor('companyId') companyId: number,
    @GetUserInfor('role') role: string,
    @Body() dto: InsertSupplier
  ) {
    if (role === 'Employee') {
      throw new ForbiddenException('You do not have permission to perform this action');
    }
    return await this.suppliersService.createSupplier(companyId, dto);
  }

  @Patch(':id')
  async updateSupplier(
    @GetUserInfor('companyId') companyId: number,
    @GetUserInfor('role') role: string,
    @Param('id', ParseIntPipe) supplierId: number,
    @Body() dto: UpdateSupplier
  ) {
    if (role === 'Employee') {
      throw new ForbiddenException('You do not have permission to perform this action');
    }
    return await this.suppliersService.updateSupplier(companyId, supplierId, dto);
  }

  @Delete()
  async deleteSupplier(
    @Body('supplierIds', new ParseIntArrayPipe('supplierIds')) supplierIds: number[],
    @GetUserInfor('companyId') companyId: number,
    @GetUserInfor('role') role: string,
  ): Promise<{ message: string; }> {
    if (role === 'Employee') {
      throw new ForbiddenException('You do not have permission to perform this action');
    }
    return await this.suppliersService.deleteSupplier(supplierIds, companyId);
  }
}
