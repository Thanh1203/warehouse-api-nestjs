import * as argon from 'argon2';
import { PrismaService } from '@/src/prisma/prisma.service';
import { Tokens } from '@/src/auth/types';
import { JwtService } from '@nestjs/jwt';

const prismaService = new PrismaService();
const jwtService = new JwtService();

export const hashData = async (data: string) => {
  return await argon.hash(data);
}

export const updateRtHash = async(userId: number, rt: string) => {
  const hash = await hashData(rt);
  await prismaService.users.update({
    where: {
      Id: userId,
    },
    data: {
      hashedRT: hash,
    },
  });
}

export const getTokens = async (userId: number, email: string, role: string, companyId: number): Promise<Tokens> => {
  const [at, rt] = await Promise.all([
    jwtService.signAsync(
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
    jwtService.signAsync(
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