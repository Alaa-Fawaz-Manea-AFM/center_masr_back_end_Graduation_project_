import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async getAllComments(postId: string, page = 1) {
    const limit = 6;
    const offset = (page - 1) * limit;

    return await this.prisma.comment.findMany({
      where: { postId },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  async createComment(userId: string, postId: string, content: string) {
    return this.prisma.$transaction(async (prisma) => {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      const comment = await prisma.comment.create({
        data: {
          userId,
          postId,
          content,
        },
      });

      await prisma.post.update({
        where: { id: postId },
        data: {
          commentCounts: { increment: 1 },
        },
      });

      return {
        message: 'Comment created successfully',
        data: comment,
      };
    });
  }

  async updateComment(userId: string, commentId: string, content: string) {
    const comment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        userId,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    return {
      message: 'Comment updated successfully',
    };
  }

  async deleteComment(userId: string, commentId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const comment = await prisma.comment.findFirst({
        where: { id: commentId, userId },
      });

      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      await prisma.comment.delete({
        where: { id: commentId },
      });

      await prisma.post.update({
        where: { id: comment.postId },
        data: {
          commentCounts: { decrement: 1 },
        },
      });

      return {
        message: 'Comment deleted successfully',
      };
    });
  }
}
