import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { signInDto, signUpDto } from './dto';
import * as argon from 'argon2';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { FieldsToDelete } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUpUser(dto: signUpDto): Promise<Tokens> {
    const hashedPassword = await this.hashData(dto.password);
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

    const tokens = await this.getTokens(
      newUser.Id,
      newUser.Email,
      newUser.Role,
      newCompanyId.Id,
    );
    await this.updateRtHash(newUser.Id, tokens.refresh_token);
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
    const tokens = await this.getTokens(user.Id, user.Email, user.Role, user.CompanyId)
    await this.updateRtHash(user.Id, tokens.refresh_token);
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

    const tokens = await this.getTokens(user.Id, user.Email, user.Role, user.CompanyId)
    await this.updateRtHash(user.Id, tokens.refresh_token)
    return tokens;
   }

  //other function
  hashData(data: string) {
    return argon.hash(data);
  }

  async getTokens(
    userId: number,
    email: string,
    role: string,
    companyId: number,
  ): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          email,
          role,
          companyId,
        },
        {
          secret: 'at-secret',
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          email,
          role,
          companyId,
        },
        {
          secret: 'rt-secret',
          expiresIn: '30d',
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    await this.prismaService.users.update({
      where: {
        Id: userId,
      },
      data: {
        hashedRT: hash,
      },
    });
  }
}
