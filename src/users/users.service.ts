import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashData } from '@/helpers';
import { InsertUserDto, UpdateUserDto } from './dto';
import { StatusUser } from '@prisma/client';

@Injectable()
export class UsersService {
 constructor(private prismaService: PrismaService) { }

  async getAllUser(page: number = 1, limit: number = 10, companyId: number) {
    const skip = (page - 1) * limit;
    const [users, totalCount] = await this.prismaService.$transaction([
      this.prismaService.users.findMany({
        where: { CompanyId: companyId },
        // skip,
        // take: limit,
        select: {
          Id: true,
          Name: true,
          Role: true,
          Address: true,
          Email: true,
          Phone: true,
          Status: true,
          CreateAt: true,
          UpdateAt: true,
        },
        
      }),
      this.prismaService.users.count({
        where: { CompanyId: companyId }
      })
    ]);

    return {
      data: users,
      totalElemnts: totalCount,
      // page,
      // limit,
    }
  }

  async searchUser(page: number = 1, limit: number = 10, companyId: number, name?: string, email?: string, phone?: string, role?: string, status?: StatusUser) {
    const skip = (page - 1) * limit;
    const [users, totalCount] = await this.prismaService.$transaction([
      this.prismaService.users.findMany({
        where: {
          CompanyId: companyId,
          ...(name && {
            Name: {
              contains: name,
              mode: 'insensitive',
            }
          }),
          ...(email && {
            Email: {
              contains: email,
              mode: 'insensitive',
            }
          }),
          ...(phone && {
            Phone: {
              contains: phone,
              mode: 'insensitive',
            }
          }),
          ...(role && { Role: role }),
          ...(status && { Status: status })
        },
        // skip,
        // take: limit,
        select: {
          Id: true,
          Name: true,
          Role: true,
          Address: true,
          Email: true,
          Phone: true,
          Status: true,
          CreateAt: true,
          UpdateAt: true,
        } 
      }),
      this.prismaService.users.count({
        where: {
          CompanyId: companyId,
          ...(name && {
            Name: {
              contains: name,
              mode: 'insensitive',
            }
          }),
          ...(email && {
            Email: {
              contains: email,
              mode: 'insensitive',
            }
          }),
          ...(phone && {
            Phone: {
              contains: phone,
              mode: 'insensitive',
            }
          }),
          ...(role && { Role: role }),
          ...(status && { Status: status })
        }
      })
    ])
    return {
      data: users,
      totalElemnts: totalCount,
      page,
      limit,
    }
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
        Role: true,
        Address: true,
        Email: true,
        Phone: true,
        Status: true,
        CreateAt: true,
        UpdateAt: true,
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
    const user = await this.prismaService.users.findUnique({
      where: { CompanyId: companyId, Id: id }
    });
    if (!user) throw new ForbiddenException('User not found');
    
    const conditions = [];
    if (dto.email) {
      conditions.push({ Email: dto.email });
    }
    if (dto.phone) {
      conditions.push({ Phone: dto.phone });
    }
    
    if (conditions.length > 0) {
      const existingUsers = await this.prismaService.users.findMany({
        where: {
          CompanyId: companyId,
          OR: conditions,
        },
      });
    
      existingUsers.forEach(existingUser => {
        if (existingUser.Id !== id) {
          if (existingUser.Email === dto.email) {
            throw new ForbiddenException('Email already exists');
          }
          if (existingUser.Phone === dto.phone) {
            throw new ForbiddenException('Phone already exists');
          }
        }
      });
    }
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
        ...(dto.status && { Status: dto.status }),
      },
      select: {
        Id: true,
        Name: true,
        Email: true,
        Role: true,
        CompanyId: true,
        Address: true,
        Phone: true,
        Status: true
      }
    });

    return updatedUser;
  }

}
