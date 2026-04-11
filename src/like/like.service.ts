import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

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
      });

      let message = 'liked';

      if (!existingLike) {
        await Promise.all([
          prisma.like.create({
            data: {
              userId,
              postId,
            },
          }),
          prisma.post.update({
            where: { id: postId },
            data: {
              likeCounts: { increment: 1 },
            },
          }),
        ]);
      } else {
        await Promise.all([
          prisma.like.delete({
            where: {
              userId_postId: {
                userId,
                postId,
              },
            },
          }),
          prisma.post.update({
            where: { id: postId },
            data: {
              likeCounts: { decrement: 1 },
            },
          }),
        ]);

        message = 'unliked';
      }

      return {
        message: `Post ${message} successfully`,
      };
    });
  }
}
