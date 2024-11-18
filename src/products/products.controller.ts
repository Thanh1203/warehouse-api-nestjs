import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AtGuard } from 'src/auth/common/guards';
import { GetUserInfor } from 'src/auth/common/decorators';
import { InsertProduct, UpdateProduct } from './dto';
import { ParseIntArrayPipe } from 'pipes';
@UseGuards(AtGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }
  
  @Get()
  async getProductInfo(
    @GetUserInfor('companyId') companyId: number,
    @Query('categoryId') categoryId?: number,
    @Query('classifyId') classifyId?: number,
    @Query('supplierId') supplierId?: number,
    @Query('name') name?: string,
    @Query('material') material?: string,
    @Query('color') color?: string,
    @Query('design') design?: string
  ) { 
    if (categoryId || classifyId || supplierId || name || material || color || design) {
      return await this.productsService.searchProduct(companyId, categoryId, classifyId, supplierId, name, material, color, design);
    } else {
      return await this.productsService.getInforProducts(companyId);
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
    @Query('supplierId') supplierId?: number, 
    @Query('categoryId') categoryId?: number,
    @Query('classifyId') classifyId?: number,
    @Query('name') name?: string,
    @Query('material') material?: string,
    @Query('color') color?: string,
    @Query('design') design?: string
  ) {
    if (!supplierId && !categoryId && !classifyId && !name) {
      return await this.productsService.getAllProductInWarehouse(companyId, warehouseId);
    } else {
      return await this.productsService.searchProductInWarehouse(companyId, warehouseId, supplierId, categoryId, classifyId, name, material, color, design);
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
    @Body('productIds', ParseIntArrayPipe) productIds: number[]
  ): Promise<{ message: string; }> {
    return await this.productsService.deleteProducts(productIds, companyId);
  }
}
