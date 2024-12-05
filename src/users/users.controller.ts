import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AtGuard } from '../auth/common/guards';
import { GetUserInfor } from '../auth/common/decorators';
import { InsertUserDto, UpdateUserDto } from './dto';
import { ParseIntArrayPipe } from '@/pipes';

@UseGuards(AtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getListUser(
    @GetUserInfor('companyId') companyId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('query') query: Record<string, any>,
  ){
    if (Object.keys(query).length === 0) {
      return await this.usersService.getAllUser(page, limit, companyId);
    } else {
      return await this.usersService.searchUser(page, limit, companyId, query);
    }
  }

  @Get('detail/:id')
  async getUserById(
    @GetUserInfor('companyId') companyId:number,
    @Param('id') id: number,
  ){
    return await this.usersService.getUserById(companyId, id);
  }

  @Post()
  async createUser(
    @GetUserInfor('companyId') companyId: number,
    @Body() dto: InsertUserDto,
  ) {
    return await this.usersService.createUser(dto, companyId);
  }

  @Patch(':id')
  async upadteUser(
    @GetUserInfor('companyId') companyId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(companyId, id, dto);
  }

  // @Delete()
  // async deleteUsers(    
  //   @GetUserInfor('companyId') companyId: number,
  //   @Body('userIds', ParseIntArrayPipe) userIds: number[]
  // ){
  //   return await this.usersService.deleteUsers(companyId, userIds);
  // }
}
