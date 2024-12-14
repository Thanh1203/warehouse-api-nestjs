import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AtGuard } from '../auth/common/guards';
import { GetUserInfor } from '../auth/common/decorators';
import { InsertUserDto, UpdateUserDto } from './dto';
import { StatusUser } from '@prisma/client';

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
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('role') role?: string,
    @Query('status') status?: StatusUser,
  ){
    if (name || email || phone || role || status) {
      return await this.usersService.searchUser(page, limit, companyId, name, email, phone, role, status);
    } else {
      return await this.usersService.getAllUser(page, limit, companyId);
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

}
