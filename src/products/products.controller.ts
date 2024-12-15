import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AtGuard } from 'src/auth/common/guards';
import { GetUserInfor } from 'src/auth/common/decorators';
import { InsertProduct, UpdateProduct } from './dto';
import { ParseIntArrayPipe } from 'pipes';
import { ProductStatus } from '@prisma/client';
@UseGuards(AtGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }
  
  @Get()
  async getProductInfo(
    @GetUserInfor('companyId') companyId: number,
    @Query('warehouseId') warehouseId?: number,
    @Query('categoryId') categoryId?: number,
    @Query('classifyId') classifyId?: number,
    @Query('supplierId') supplierId?: number,
    @Query('name') name?: string,
    @Query('code') code?: string,
    @Query('status') status?: ProductStatus,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) { 
    if (categoryId || classifyId || supplierId || name || code || status || warehouseId) {
      return await this.productsService.searchProduct(companyId, warehouseId, categoryId, classifyId, supplierId, name, code, status, page, limit);
    } else {
      return await this.productsService.getInforProducts(companyId, page, limit);
    }
  }

  @Get(':id')
  async getDetailProduct(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number
  ) {
    return await this.productsService.getDetailProduct(id, companyId);
  }


  // Get and search all products in warehouse
  @Get('warehouse/:warehouseId')
  async getProductsInWarehouse(
    @GetUserInfor('companyId') companyId: number,
    @Param('warehouseId') warehouseId?: number,
    @Query('categoryId') categoryId?: number,
    @Query('classifyId') classifyId?: number,
    @Query('supplierId') supplierId?: number,
    @Query('name') name?: string,
    @Query('code') code?: string,
    @Query('isRestock') isRestock?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    if (categoryId || classifyId || supplierId || name || code) {
      return await this.productsService.searchProductInWarehouse(companyId, warehouseId, supplierId, categoryId, classifyId, name, code, isRestock, page, limit);

    } else {
      return await this.productsService.getAllProductInWarehouse(companyId, warehouseId);
    }
  }

  @Post()
  async createProduct(
    @GetUserInfor('companyId') companyId: number,
    @Body() dto: InsertProduct
  ) {
    return await this.productsService.createProduct(companyId, dto);
  }

  @Patch(':id')
  async updateProduct(
    @GetUserInfor('companyId') companyId: number,
    @Param('id') id: number,
    @Body() dto: UpdateProduct
  ) {
    return await this.productsService.updateProduct(companyId, id, dto);
  }

  @Delete()
  async deleteProducts(
    @GetUserInfor('companyId') companyId: number,
    @Body('productIds', new ParseIntArrayPipe('productIds')) productIds: number[]
  ): Promise<{ message: string; }> {
    return await this.productsService.deleteProducts(productIds, companyId);
  }
}
