import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { roleTeacherAndCenterSet } from 'src/utils';

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
        throw new BadRequestException(
          'Invalid role must be (teacher or center)',
        );
      }

      const follow = await prisma.follower.findUnique({
        where: {
          followingId_followerId: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        },
      });

      const isFollowing = !!follow;

      await Promise.all([
        isFollowing
          ? prisma.follower.delete({
              where: {
                followingId_followerId: {
                  followerId: currentUserId,
                  followingId: targetUserId,
                },
              },
            })
          : prisma.follower.create({
              data: {
                followerId: currentUserId,
                followingId: targetUserId,
              },
            }),

        prisma.user.update({
          where: { id: targetUserId },
          data: {
            followerCounts: {
              [isFollowing ? 'decrement' : 'increment']: 1,
            },
          },
        }),

        prisma.user.update({
          where: { id: currentUserId },
          data: {
            followingCounts: {
              [isFollowing ? 'decrement' : 'increment']: 1,
            },
          },
        }),
      ]);

      return {
        message: `User ${isFollowing ? 'unfollowed' : 'followed'} successfully`,
      };
    });
  }
}
