import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { GetUserInfor } from 'src/auth/common/decorators';
import { InsertCategory, UpdateCategory } from './dto';
import { ParseIntArrayPipe } from 'pipes';
import { AtGuard } from 'src/auth/common/guards';
@UseGuards(AtGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }
  
  @Get()
  async getCategories(
    @GetUserInfor('companyId') companyId: number,
    @Query('warehouseId') warehouseId?: number,
    @Query('supplierId') supplierId?: number,
    @Query('name') name?: string,
    @Query('code') code?: string,
    @Query('isRestock') isRestock?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    if (!warehouseId && !supplierId && !name && !isRestock) {
      return await this.categoriesService.getCategories(companyId, page, limit);
    } else {
      return await this.categoriesService.searchCategories(companyId, warehouseId, supplierId, name, code, isRestock, page, limit);
    }
  }

  @Post()
  async createCategory(
    @GetUserInfor('companyId') companyId: number,
    @Body() dto: InsertCategory
  ) {
    return await this.categoriesService.createCategory(companyId, dto);
  }

  @Patch(':id')
  async updateCategory(
    @GetUserInfor('companyId') companyId: number,
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() dto: UpdateCategory
  ) {
    return await this.categoriesService.updateCategory(companyId, categoryId, dto);
  }

  @Delete()
  async deleteCategory(
    @GetUserInfor('companyId') companyId: number,
    @Body('categoryIds', new ParseIntArrayPipe('categoryIds')) categoryIds: number[]
  ): Promise<{ message: string; }> {
    return await this.categoriesService.deleteCategory(categoryIds, companyId);
  }
}
