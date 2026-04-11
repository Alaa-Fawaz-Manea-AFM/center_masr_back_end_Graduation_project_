import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetAllUsersDto } from './dto/getAllUsersDto';
import { roleTeacherAndCenterSet } from 'src/utils';
import {
  ExtraProfileDataType,
  ProfileDataType,
  UserDataType,
} from 'src/types/type';

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
    if (!roleTeacherAndCenterSet.has(role))
      throw new BadRequestException('invalid Role, must be teacher or center');

    const profileRole = `profile_${role}`;
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        [role]: true,
        [profileRole]: true,
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

    return { ...user, isFollowed, role };
  }

  async getAllUsers(filters: GetAllUsersDto, page = 1, limit = 6) {
    const offset = (page - 1) * limit;
    const { role } = filters;

    let profileWhere: any = {};
    if (filters.role === 'teacher') {
      if (filters.classRoom) {
        profileWhere.classRoom = {
          contains: filters.classRoom,
          mode: 'insensitive',
        };
      }

      if (filters.studyMaterial) {
        profileWhere.studyMaterial = {
          contains: filters.studyMaterial,
          mode: 'insensitive',
        };
      }
    }

    if (filters.role === 'center') {
      if (filters.educationalStage) {
        profileWhere.educationalStage = {
          has: filters.educationalStage,
        };
      }

      if (filters.governorate) {
        profileWhere.governorate = {
          contains: filters.governorate,
          mode: 'insensitive',
        };
      }
    }

    let userWhere: any = {};
    if (filters.name) {
      userWhere.name = {
        contains: filters.name,
        mode: 'insensitive',
      };
      profileWhere = {};
    }

    const relationMap = {
      teacher: 'teacher',
      center: 'center',
    };

    const relation = relationMap[filters.role];

    const users = await this.prisma.user.findMany({
      where: {
        role,
        name: filters.name
          ? { contains: filters.name, mode: 'insensitive' }
          : undefined,
        [relation]: Object.keys(profileWhere).length
          ? { AND: [profileWhere] }
          : undefined,
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        [role]: true,
      },
      skip: offset,
      take: limit,
    });

    return users;
  }

  async updateUser(
    id: string,
    role: string,
    userData: UserDataType,
    profileData: ProfileDataType,
    extraPrifileData: ExtraProfileDataType,
  ) {
    const include = { [role]: true };
    const prifileRole = this.toUpperCase(role);

    if (roleTeacherAndCenterSet.has(role)) {
      include[prifileRole] = true;
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      include,
    });
    if (!user) throw new NotFoundException('User not found');

    const currentRole = user.role;
    if (role && role !== currentRole) {
      throw new ForbiddenException("You can't update user role");
    }

    return this.prisma.$transaction(async (prisma) => {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: userData,
      });

      const updatedUserProfile = await prisma[role].update({
        where: { id },
        data: profileData,
      });

      let extraUpdatePrifileData = {};
      if (roleTeacherAndCenterSet.has(role)) {
        extraUpdatePrifileData = await prisma[prifileRole].update({
          where: { userId: id },
          data: extraPrifileData,
        });
      }
      return { updatedUser, updatedUserProfile, extraUpdatePrifileData };
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.delete({ where: { id } });
    return true;
  }
}
