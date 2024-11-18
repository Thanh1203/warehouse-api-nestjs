import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { AtGuard } from '../auth/common/guards';
import { GetUserInfor } from '../auth/common/decorators';
import { ParseIntArrayPipe } from '@/pipes';
import { InsertCustomer } from './dto/insert.customer';
import { UpdateCustomer } from './dto/update.customer';

@UseGuards(AtGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async getCustomers(
    @GetUserInfor('companyId') companyId: number,
    @Query('warehouseId') warehouseId?: number,
  ) {
    if (warehouseId) {
      return await this.customersService.getAllCustomerByWarehouse(companyId, warehouseId);
    } else {
      return await this.customersService.getAllCustomers(companyId);
    }
  }

  @Get('search')
  async searchCustomer(
    @GetUserInfor('companyId') companyId,
    @Query('keyword') keyword: string
  ) {
    return await this.customersService.searchCustomer(companyId, keyword);
  }
  

  @Get(':id')
  async getDetailCustomer(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number,
  ) { 
    return await this.customersService.getDetailCustomer(companyId, id);
  }

  @Post()
  async createCustomer(
    @GetUserInfor('companyId') companyId: number,
    @Body() dto: InsertCustomer,
  ) {
    return await this.customersService.createCustomer(companyId, dto);
  }

  @Patch(':id')
  async updateCustomer(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number,
    @Body() dto: UpdateCustomer,
  ) { 
    return await this.customersService.updateCustomer(companyId, id, dto);
  }

  @Delete()
  async deleteCustomers(
    @GetUserInfor('companyId') companyId: number,
    @Body('ids', ParseIntArrayPipe) ids: number[],
  ) { 
    return await this.customersService.deleteCustomers(companyId, ids);
  }
}
