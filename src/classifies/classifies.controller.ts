import { Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ClassifiesService } from './classifies.service';
import { AtGuard } from 'src/auth/common/guards';

UseGuards(AtGuard)
@Controller('classifies')
export class ClassifiesController {
  constructor(private readonly classifiesService: ClassifiesService) { }
  
  @Get()
  async getClassifies() {

  }

  @Post()
  async createClassify() {

  }

  @Patch()
  async updateClassify() {
    
  }

  @Delete()
  async deleteClassifies() {

  }
}
