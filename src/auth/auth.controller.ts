import { Post, Body, Req, Res, Get, Controller } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import SignUpAuthDto from './dto/sign-up-auth.dto';
import SignInAuthDto from './dto/sign-in-auth.dto';
import AuthDecorator from 'src/decorator/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @AuthDecorator()
  @Post('signup')
  async signUp(
    @Body() signUpAuthDto: SignUpAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signUp(signUpAuthDto, res);
  }

  @AuthDecorator()
  @Post('login')
  async login(
    @Body() signInAuthDto: SignInAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(signInAuthDto, res);
  }

  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req.user.userId, res);
  }

  @AuthDecorator()
  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { refreshToken } = req.cookies;
    return this.authService.refreshToken(refreshToken, res);
  }

  @Get('me')
  async getMe(@Req() req) {
    const { userId, role } = req.user;
    return this.authService.getMe(userId, role);
  }
}
