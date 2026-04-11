import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import AppConfig from '../config/app.config';
import { IfAppError, roleTeacherAndCenterSet } from 'src/utils';
import { JwtService } from '@nestjs/jwt';
import SignUpAuthDto from './dto/sign-up-auth.dto';
import SignInAuthDto from './dto/sign-in-auth.dto';
import { compare, hash } from 'bcrypt';
import { PayloadTokenType } from 'src/types/type';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: AppConfig,
  ) {}

  toUpperCase(str: string) {
    const data = str.slice(0, 1).toUpperCase() + str.slice(1);

    return `profile${data}`;
  }

  async signUp(signUpAuthDto: SignUpAuthDto) {
    const { email, role } = signUpAuthDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    IfAppError(existingUser, 'Email already exists', 400);

    return this.prisma.$transaction(async (prisma) => {
      const hashedPassword = await hash(signUpAuthDto.password, 10);
      const user = await prisma.user.create({
        data: { ...signUpAuthDto, password: hashedPassword },
      });

      const userId = user?.id;
      const data = { data: { userId } };
      let roleModel = await prisma[`${role}`].create(data);

      if (roleTeacherAndCenterSet.has(role)) {
        await prisma[this.toUpperCase(role)].create(data);
      }

      const payload: PayloadTokenType = {
        userId,
        profileId: roleModel.id,
        role,
      };

      const accessToken = await this.JWTSign(payload);

      const refreshToken = await this.JWTSign(payload, true);

      const hashRefreshToken = await hash(refreshToken, 12);

      await prisma.refreshToken.upsert({
        where: { userId },
        update: { token: hashRefreshToken },
        create: { userId, token: hashRefreshToken },
      });

      return {
        user,
        accessToken,
        refreshToken,
      };
    });
  }

  async login(signInAuthDto: SignInAuthDto) {
    const { email, password } = signInAuthDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        teacher: true,
        center: true,
        student: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    let profileId = user[`${user.role}`]?.id;
    let { id: userId, role } = user;

    const payload: PayloadTokenType = {
      userId,
      profileId,
      role,
    };

    const accessToken = await this.JWTSign(payload);

    const refreshToken = await this.JWTSign(payload, true);

    const hashRefreshToken = await hash(refreshToken, 12);

    await this.prisma.refreshToken.upsert({
      where: { userId },
      update: { token: hashRefreshToken },
      create: { userId, token: hashRefreshToken },
    });

    return { user, accessToken, refreshToken };
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return true;
  }

  async refreshToken(oldToken: string) {
    let payload: any;

    try {
      payload = await this.jwtService.verifyAsync(oldToken, {
        secret: this.config.jwtRefreshSecret,
      });
    } catch {
      throw new ForbiddenException('Invalid refresh token');
    }

    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { userId: payload.userId },
    });

    if (!tokenRecord) throw new ForbiddenException('Invalid refresh token');

    const isMatch = await compare(oldToken, tokenRecord.token);
    if (!isMatch) throw new ForbiddenException('Invalid refresh token');

    const newAccessToken = await this.jwtService.signAsync({
      userId: payload.userId,
      profileId: payload.profileId,
      role: payload.role,
    });

    return { accessToken: newAccessToken };
  }

  async getMe(userId: string, role: string) {
    const include = {};

    include[role] = true;
    if (roleTeacherAndCenterSet.has(role)) {
      include[this.toUpperCase(role)] = true;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include,
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async JWTSign(payload: PayloadTokenType, refresh: boolean = false) {
    return await this.jwtService.signAsync(
      payload,
      refresh
        ? {
            secret: this.config.jwtRefreshSecret,
            expiresIn: this.config.jwtRefreshExpiresIn as any,
          }
        : {},
    );
  }
}
