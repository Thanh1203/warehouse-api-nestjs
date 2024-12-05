import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashData } from '@/helpers';
import { InsertUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
 constructor(private prismaService: PrismaService) { }

  async getAllUser(page: number = 1, limit: number = 10, companyId: number) {
    const skip = (page - 1) * limit;
    const [users, totalCount] = await this.prismaService.$transaction([
      this.prismaService.users.findMany({
        where: { CompanyId: companyId },
        skip,
        take: limit,
      }),
      this.prismaService.users.count()
    ]);

    return {
      data: users,
      totalElemnts: totalCount,
      page,
      limit,
    }
  }

  async searchUser(page: number = 1, limit: number = 10, companyId: number, query: Record<string, any>) {
    const skip = (page - 1) * limit;
    const { name, email, phone, role } = query;
    return await this.prismaService.users.findMany({
      where: {
        CompanyId: companyId,
        ...(name && { Name: { contains: name, mode: 'insensitive' } }),
        ...(email && { Email: { contains: email, mode: 'insensitive' } }),
        ...(phone && { Phone: { contains: phone, mode: 'insensitive' } }),
        ...(role && { Role: role }),
      },
      skip,
      take: limit,
      orderBy: {
        CreateAt: 'desc',
      },
    });
  }

  async getUserById(companyId: number, id: number) {
    return await this.prismaService.users.findUnique({
      where: {
        Id: id,
        CompanyId: companyId,
      },
    });
  }


  async createUser(dto: InsertUserDto, companyId: number) {
    const hashedPassword = await hashData(dto.password);
    const newUser = await this.prismaService.users
    .create({
      data: {
        Name: dto.name,
        Role: dto.role,
        CompanyId: companyId,
        Address: dto.address,
        Email: dto.email,
        Password: hashedPassword,
        Phone: dto.phone,
      },
      select: {
        Id: true,
        Name: true,
        Email: true,
        Role: true,
        CompanyId: true,
        Address: true,
        Phone: true,
      },
    })
    .catch((error) => {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Email already exists');
      }
      throw new ForbiddenException('Cannot create new user');
    });

    return newUser;
  }

  async updateUser(companyId: number, id: number, dto: UpdateUserDto) {
    await this.prismaService.users.findUnique({
      where: {
        CompanyId: companyId,
        Id: id
      }
    }).catch((error) => {
      console.log(error);
      throw new ForbiddenException('User not found');
    });
    const updatedUser = await this.prismaService.users.update({
      where: {
        CompanyId: companyId,
        Id: id,
      },
      data: {
        ...(dto.name && { Name: dto.name }),
        ...(dto.role && { Role: dto.role }),
        ...(dto.address && { Address: dto.address }),
        ...(dto.phone && { Phone: dto.phone }),
        ...(dto.email && { Email: dto.email }),
      },
      select: {
        Id: true,
        Name: true,
        Email: true,
        Role: true,
        CompanyId: true,
        Address: true,
        Phone: true,
      }
    });

    return updatedUser;
  }

  // async deleteUsers(companyId: number, ids: number[]) {
  //   const currentUser =  await this.prismaService.users.findMany({
  //     where: {
  //       CompanyId: companyId,
  //       Id: {
  //         in: ids,
  //       }
  //     }
  //   }).catch((error) => {
  //     console.log(error);
  //     throw new ForbiddenException('User not found');
  //   });
  // }
}
