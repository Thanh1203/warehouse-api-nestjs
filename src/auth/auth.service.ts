import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { signInDto, signUpDto } from './dto';
import * as argon from 'argon2';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { FieldsToDelete } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private jwtService: JwtService) {}
  
  async signUpUser(dto: signUpDto): Promise<Tokens> {
    const hashedPassword = await this.hashData(dto.password);
    const newCompanyId = await this.generateCompanyId();
    try {
      const newUser = await this.prismaService.users.create({
        data: {
          Name: dto.name,
          Position: 'Admin',
          CompanyId: newCompanyId,
          Address: dto.address,
          Email: dto.email,
          Password: hashedPassword
        },
        select: {
          Id: true,
          Name: true,
          Email: true,
          Position: true,
          CompanyId: true,
          Address: true,
        }
      })
      const tokens = await this.getTokens(newUser.Id, newUser.Email, newUser.Position, newUser.CompanyId)
      await this.updateRtHash(newUser.Id, tokens.refresh_token);
      FieldsToDelete.forEach(field => {
        delete newUser[field];
      })
      return {
        ...newUser,
        ...tokens
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Email already exists')
      }
    }
  }
  
  async signinUser(dto: signInDto): Promise<Tokens> { 
    const user = await this.prismaService.users.findUnique({
      where: {
        Email: dto.email
      }
    })

    if (!user) {
      throw new ForbiddenException('Access Denied')
    }

    const passwordMatches = await argon.verify(user.Password, dto.password)

    if (!passwordMatches) {
      throw new ForbiddenException('Incorrect password')
    }

    const tokens = await this.getTokens(user.Id, user.Email, user.Position, user.CompanyId)
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
    })
    
    if (!user) {
      throw new ForbiddenException("Acces denied")
    }

    const rMatches = await argon.verify(user.hashedRT, rt)
    
    if (!rMatches) {
      throw new ForbiddenException("Acces denied")
    }

    const tokens = await this.getTokens(user.Id, user.Email, user.Position, user.CompanyId)

    await this.updateRtHash(user.Id, tokens.refresh_token)
    return tokens;
   }
  
  //other function
  hashData(data: string) {
    return argon.hash(data);
  }

  async generateCompanyId() {
    while (true) {
      const randomId = Math.floor(1000 + Math.random() * 9000);
      
      const checkId = await this.prismaService.users.findFirst({
        where: {
          CompanyId: randomId,
        }
      })

      if (!checkId) {
        return randomId
      }
    }
  }

  async getTokens(userId: number, email: string, role: string, companyId: number): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync({
        id: userId,
        email,
        role,
        companyId,
      }, {
        secret: 'at-secret',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync({
        id: userId,
        email,
        role,
        companyId,
      }, {
        secret: 'rt-secret',
        expiresIn: '30d',
      })
    ])

    return {
      access_token: at,
      refresh_token: rt
    }
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt)
    await this.prismaService.users.update({
      where: {
        Id: userId
      },
      data: {
        hashedRT: hash
      }
    })
  }

}
