import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { signInDto, signUpDto } from './dto';
import * as argon from 'argon2';
import { Tokens } from './types';
import { FieldsToDelete } from 'src/constants';
import { getTokens, hashData, updateRtHash } from '@/helpers';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async signUpUser(dto: signUpDto): Promise<Tokens> {
    const hashedPassword = await hashData(dto.password);
    const newCompanyId = await this.prismaService.company
      .create({
        data: {
          Name: 'New company',
        },
      })
      .catch(() => {
        throw new ForbiddenException('Cannot create new company');
      });

    const newUser = await this.prismaService.users
      .create({
        data: {
          Name: dto.name,
          Role: 'Admin',
          CompanyId: newCompanyId.Id,
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

    const tokens = await getTokens(
      newUser.Id,
      newUser.Email,
      newUser.Role,
      newCompanyId.Id,
    );
    await updateRtHash(newUser.Id, tokens.refresh_token);
    FieldsToDelete.forEach((field) => {
      delete newUser[field];
    });
    return {
      ...newUser,
      ...tokens,
    };
  }

  async signinUser(dto: signInDto): Promise<Tokens> {
    const user = await this.prismaService.users.findUnique({
      where: {
        Email: dto.email,
      },
    }).catch((error) => {
      console.log(error);
      throw new ForbiddenException('Access Denied');
    });
    await argon.verify(user.Password, dto.password).catch((error) => { 
      console.log(error);
      throw new ForbiddenException('Incorrect password') 
    });
    const tokens = await getTokens(user.Id, user.Email, user.Role, user.CompanyId)
    await updateRtHash(user.Id, tokens.refresh_token);
    FieldsToDelete.forEach(field => {
      delete user[field];
    })
    return {
      ...user,
      ...tokens
    };
  }

  async logoutUser(userId: number) {
    await this.prismaService.users.updateMany({
      where: {
        Id: userId,
        hashedRT: {
          not: null,
        }
      },
      data: {
        hashedRT: null
      }
    })

    return {
      message: 'Logout successful'
    }
  }

  async refreshToken(userId: number, rt: string) {
    const user = await this.prismaService.users.findUnique({
      where: {
        Id: userId
      }
    }).catch((error) => {
      console.log(error);
      throw new ForbiddenException('Access Denied');
    });

    await argon.verify(user.hashedRT, rt).catch((error) => {
      console.log(error);
      throw new ForbiddenException("Acces denied")
    });

    const tokens = await getTokens(user.Id, user.Email, user.Role, user.CompanyId)
    await updateRtHash(user.Id, tokens.refresh_token)
    return tokens;
  }

}
