import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetAllUsersDto } from './dto/getAllUsersDto';
import {
  CENTER,
  roleTeacherAndCenterSet,
  sendResponsive,
  TEACHER,
} from 'src/utils';
import {
  ExtraProfileDataType,
  ProfileDataType,
  UserDataType,
} from 'src/types/type';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  toUpperCase(str: string) {
    const data = str.slice(0, 1).toUpperCase() + str.slice(1);

    return `profile${data}`;
  }
  async getUserById(
    targetUserId: string,
    role: string,
    currentUserId?: string,
  ) {
    const includeAndOmit = {
      include: true,
      omit: { userId: true },
    };

    if (!roleTeacherAndCenterSet.has(role))
      throw new BadRequestException('invalid Role, must be teacher or center');

    const profileRole = `profile_${role}`;
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        [role]: includeAndOmit,
        [profileRole]: includeAndOmit,
      },
      omit: { email: true, password: true, updatedAt: true },
    });

    if (!user || user.role !== role)
      throw new NotFoundException('User not found');

    let isFollowed = false;

    if (currentUserId) {
      const follow = await this.prisma.follower.findUnique({
        where: {
          followingId_followerId: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        },
        select: { id: true },
      });

      isFollowed = !!follow;
    }

    return sendResponsive(
      {
        ...user,
        isFollowed,
        role,
      },
      'User retrieved successfully',
    );
  }

  async getAllUsers(filters: GetAllUsersDto, page = 1, limit = 6) {
    const skip = (page - 1) * limit;
    const { role, name } = filters;

    const baseWhere: any = {
      role,
    };

    if (name) {
      baseWhere.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (role === TEACHER) {
      baseWhere.teacher = {
        ...(filters.classRoom && {
          classRoom: {
            contains: filters.classRoom,
            mode: 'insensitive',
          },
        }),
        ...(filters.studyMaterial && {
          studyMaterial: {
            contains: filters.studyMaterial,
            mode: 'insensitive',
          },
        }),
      };
    }

    if (role === CENTER) {
      baseWhere.center = {
        ...(filters.educationalStage && {
          educationalStage: {
            has: filters.educationalStage,
          },
        }),
        ...(filters.governorate && {
          governorate: {
            contains: filters.governorate,
            mode: 'insensitive',
          },
        }),
      };
    }

    const users = await this.prisma.user.findMany({
      where: baseWhere,

      select: {
        id: true,
        name: true,
        imageUrl: true,

        teacher:
          role === TEACHER
            ? {
                select: {
                  id: true,
                  classRoom: true,
                  studyMaterial: true,
                },
              }
            : undefined,
        center:
          role === CENTER
            ? {
                select: {
                  id: true,
                  educationalStage: true,
                  governorate: true,
                  studySystem: true,
                },
              }
            : undefined,
      },

      skip,
      take: limit,
    });

    return users;
  }

  async updateUser(
    id: string,
    role: Role,
    userData: UserDataType,
    profileData: ProfileDataType,
    extraProfileData: ExtraProfileDataType,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, role: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (role !== user.role) {
        throw new ForbiddenException("You can't change user role");
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: userData,
      });

      let profileUpdateResult: any = null;
      let extraUpdateResult: any = null;

      if (role === TEACHER) {
        profileUpdateResult = await prisma.profileTeacher.update({
          where: { userId: id },
          data: profileData as any,
        });
      }

      if (role === 'center') {
        profileUpdateResult = await prisma.profileCenter.update({
          where: { userId: id },
          data: profileData as any,
        });

        extraUpdateResult = await prisma.profileCenter.update({
          where: { userId: id },
          data: extraProfileData,
        });
      }

      if (role === 'student') {
        profileUpdateResult = await prisma.student.update({
          where: { userId: id },
          data: profileData as any,
        });
      }

      return sendResponsive(
        {
          updatedUser,
          profileUpdateResult,
          extraUpdateResult,
        },
        'User retrieved successfully',
      );
    });
  }

  async deleteUser(id: string) {
    return await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!user) throw new NotFoundException('User not found');

      await prisma.user.delete({
        where: { id },
      });
    });
  }
}
