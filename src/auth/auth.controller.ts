import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto, signUpDto } from './dto';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AtGuard, RtGuard } from './common/guards';
import { GetUserInfor } from './common/decorators';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) { }
  
  @Post('signup') // dang ky
  @HttpCode(HttpStatus.CREATED)
  signUpUser(@Body() dto: signUpDto): Promise<Tokens>{
    return this.authService.signUpUser(dto);
  }

  @Post('signin') // dang nhap
  @HttpCode(HttpStatus.OK)
  signinUser(@Body() dto: signInDto): Promise<Tokens> {
    return this.authService.signinUser(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout') // thoat
  @HttpCode(HttpStatus.OK)
  logoutUser(@GetUserInfor('id') userId: number) {
    return this.authService.logoutUser(userId);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetUserInfor('id') userId: number,
    @GetUserInfor('refreshToken') rtToken: string
  ) {
    return this.authService.refreshToken(userId, rtToken);
  }
}
