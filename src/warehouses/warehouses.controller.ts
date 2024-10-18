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
  gethWarehouses(
    @GetUserInfor('companyId') companyId: number,
    @Query('name') name?: string
  ) {
    if (name) {
      return this.warehousesService.searchWarehouse(companyId, name);
    } else {
      return this.warehousesService.gethWarehouses(companyId);
    }
  }
    
  @Post()
  createWarehouse(
    @GetUserInfor('companyId') companyId: number,
    @Body() dto: InsertWarehouse
  ) {
    return this.warehousesService.createWarehouse(companyId, dto);
  }

  @Patch(':id')
  updateWarehouse(
    @Param('id', ParseIntPipe) warehouseId: number,
    @Body() dto: UpdateWarehouse
  ) {
    return this.warehousesService.updateWarehouse(warehouseId, dto);
  }


  @Delete(':id')
  deleteWarehouse(
    @Param('id', ParseIntPipe) warehouseId: number,
  ) {
    return this.warehousesService.deleteWarehouse(warehouseId);
  }
}
