import { Injectable, NotFoundException } from '@nestjs/common';
import { Like } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}
  async toggleLike(userId: string, postId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
        select: { id: true },
      });

      let like: Like;
      if (existingLike) {
        like = await prisma.like.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });
        if (!like?.id) throw new NotFoundException('like not found');

        await prisma.post.update({
          where: { id: postId },
          data: {
            likeCounts: { decrement: 1 },
          },
        });

        return sendResponsive(null, 'Post unliked successfully');
      }

      like = await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });

      if (!like?.id) throw new NotFoundException('like not found');

      await prisma.post.update({
        where: { id: postId },
        data: {
          likeCounts: { increment: 1 },
        },
      });

      return sendResponsive(null, 'Post liked successfully');
    });
  }
}
