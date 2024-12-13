import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { AtGuard } from 'src/auth/common/guards';
import { GetUserInfor } from 'src/auth/common/decorators';
import { InsertWarehouse, UpdateWarehouse } from './dto';

@UseGuards(AtGuard)
@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) { }
  
  @Get()
  async gethWarehouses(
    @GetUserInfor('companyId') companyId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('name') name?: string,
  ) {
    if (name) {
      return await this.warehousesService.searchWarehouse(companyId, name, page, limit);
    } else {
      return await this.warehousesService.getAllWarehouse(companyId, page, limit);
    }
  }
    
  @Post()
  async createWarehouse(
    @GetUserInfor('companyId') companyId: number,
    @Body() dto: InsertWarehouse
  ) {
    return await this.warehousesService.createWarehouse(companyId, dto);
  }

  @Patch(':id')
  async updateWarehouse(
    @Param('id', ParseIntPipe) warehouseId: number,
    @Body() dto: UpdateWarehouse
  ) {
    return await this.warehousesService.updateWarehouse(warehouseId, dto);
  }

  @Delete(':id')
  async deleteWarehouse(
    @Param('id', ParseIntPipe) warehouseId: number,
  ) {
    return await this.warehousesService.deleteWarehouse(warehouseId);
  }
}
