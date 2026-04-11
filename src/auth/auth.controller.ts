import {
  Post,
  Body,
  Req,
  Res,
  Get,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { sendResponsive } from 'src/utils';
import { AuthService } from './auth.service';
import SignUpAuthDto from './dto/sign-up-auth.dto';
import SignInAuthDto from './dto/sign-in-auth.dto';
import { UserResponseInterceptor } from 'src/interceptor/UserResponeInterceptor';
import AuthDecorator from 'src/decorator/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @AuthDecorator()
  @UseInterceptors(UserResponseInterceptor)
  @Post('signup')
  async signUp(
    @Body() signUpAuthDto: SignUpAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.signUp(signUpAuthDto);

    res.cookie('accessToken', data.accessToken);
    res.cookie('refreshToken', data.refreshToken);

    return sendResponsive(data, 'Sign up successfully');
  }

  @AuthDecorator()
  @UseInterceptors(UserResponseInterceptor)
  @Post('login')
  async login(
    @Body() signInAuthDto: SignInAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.login(signInAuthDto);

    res.cookie('accessToken', data.accessToken);
    res.cookie('refreshToken', data.refreshToken);

    return sendResponsive(data, 'Logged in successfully');
  }

  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user.userId);

    res.clearCookie('accessToken').clearCookie('refreshToken');

    return sendResponsive(null, 'Logged out successfully');
  }

  @AuthDecorator()
  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { refreshToken } = req.cookies;

    const data = await this.authService.refreshToken(refreshToken);

    res.cookie('accessToken', data.accessToken);

    return sendResponsive(data, 'Refresh token');
  }

  @UseInterceptors(UserResponseInterceptor)
  @Get('me')
  async getMe(@Req() req) {
    const user = await this.authService.getMe(req.user.userId, req.user.role);

    return sendResponsive(user, 'User data');
  }
}
