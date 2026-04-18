import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { roleTeacherAndCenterSet, sendResponsive } from 'src/utils';

@Injectable()
export class FollowerService {
  constructor(private prisma: PrismaService) {}
  async toggleFollowUser(currentUserId: string, targetUserId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { id: true, role: true },
      });

      if (!targetUser) {
        throw new NotFoundException('User not found');
      }

      if (!roleTeacherAndCenterSet.has(targetUser.role)) {
        throw new BadRequestException('Invalid role (teacher or center only)');
      }

      const existingFollow = await prisma.follower.findUnique({
        where: {
          followingId_followerId: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        },
      });

      const isFollowing = !!existingFollow;

      try {
        if (isFollowing) {
          await prisma.follower.delete({
            where: {
              followingId_followerId: {
                followerId: currentUserId,
                followingId: targetUserId,
              },
            },
          });
        } else {
          await prisma.follower.create({
            data: {
              followerId: currentUserId,
              followingId: targetUserId,
            },
          });
        }
      } catch (error) {
        throw new BadRequestException('error follwer');
      }

      await Promise.all([
        prisma.user.update({
          where: { id: targetUserId },
          data: {
            followerCounts: {
              increment: isFollowing ? -1 : 1,
            },
          },
        }),

        prisma.user.update({
          where: { id: currentUserId },
          data: {
            followingCounts: {
              increment: isFollowing ? -1 : 1,
            },
          },
        }),
      ]);

      return sendResponsive(
        null,
        `User ${isFollowing ? 'unfollowed' : 'followed'} successfully`,
      );
    });
  }
}
