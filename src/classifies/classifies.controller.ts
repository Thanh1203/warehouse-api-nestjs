import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ClassifiesService } from './classifies.service';
import { AtGuard } from 'src/auth/common/guards';
import { GetUserInfor } from 'src/auth/common/decorators';
import { InsertClassify } from './dto/insert.classify.dto';
import { UpdateClassify } from './dto/update.classify.dto';
import { ParseIntArrayPipe } from 'pipes';

@UseGuards(AtGuard)
@Controller('classifies')
export class ClassifiesController {
  constructor(private readonly classifiesService: ClassifiesService) { }
  
  @Get()
  async getClassifies(
    @GetUserInfor('companyId') companyId: number,
    @Query('warehouseId') warehouseId ?: number,
    @Query('supplierId') supplierId?: number,
    @Query('categoryId') categoryId?: number,
    @Query('name') name?: string,
    @Query('code')  code?: string,
    @Query('isRestock') isRestock?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    if (!warehouseId && !supplierId && !categoryId && !name && !isRestock && !code) {
      return await this.classifiesService.getClassifies(companyId, page, limit);
    } else {
      return await this.classifiesService.searchClassifies(companyId, warehouseId, categoryId, supplierId, name, code, isRestock, page, limit);
    }
  }

  @Post()
  async createClassify(
    @GetUserInfor('companyId') companyId: number,
    @Body() dto: InsertClassify
  ) {
    return await this.classifiesService.createClassify(companyId, dto);
  }

  @Patch(':id')
  async updateClassify(
    @GetUserInfor('companyId') companyId: number,
    @Param('id', ParseIntPipe) classifyId: number,
    @Body() dto: UpdateClassify
  ) {
    return await this.classifiesService.updateClassify(companyId, dto,classifyId);
  }

  @Delete()
  async deleteClassifies(
    @GetUserInfor('companyId') companyId: number,
    @Body('classifyIds', new ParseIntArrayPipe('classifyIds')) classifyIds: number[]
  ): Promise<{ message: string; }> {
    return await this.classifiesService.deleteClassify(classifyIds, companyId);
  }
}
