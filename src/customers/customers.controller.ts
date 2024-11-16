import { Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { AtGuard } from '../auth/common/guards';
import { GetUserInfor } from '../auth/common/decorators';

@UseGuards(AtGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async getCustomers(
    @GetUserInfor('companyId') companyId: number,
    @Query('warehouseId') warehouseId?: number,
    @Query('phone') phone?: string,
    @Query('name') name?: string,
  ) {

  }

  @Get(':id')
  async getDetailCustomer(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number,
  ) { }

  @Post()
  async createCustomer() { }

  @Patch(':id')
  async updateCustomer() { }

  @Delete()
  async deleteCustomer() { }
}
