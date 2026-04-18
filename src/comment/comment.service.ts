import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async getAllComments(postId: string, cursor?: string) {
    const limit = 6;

    const comments = await this.prisma.comment.findMany({
      where: { postId },
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
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

    return sendResponsive(
      {
        data: comments,
        nextCursor:
          comments.length === limit ? comments[comments.length - 1].id : null,
      },
      'Comments retrieved successfully',
    );
  }

  async createComment(userId: string, postId: string, content: string) {
    return this.prisma.$transaction(async (prisma) => {
      const comment = await prisma.comment.create({
        data: { userId, postId, content },
      });

      if (!comment) {
        throw new NotFoundException('Post not found');
      }

      await prisma.post.updateMany({
        where: { id: postId },
        data: {
          commentCounts: { increment: 1 },
        },
      });

      return sendResponsive(comment, 'Comment created successfully');
    });
  }
  async updateComment(userId: string, commentId: string, content: string) {
    const result = await this.prisma.comment.updateMany({
      where: {
        id: commentId,
        userId,
      },
      data: {
        content,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Comment not found');
    }

    return sendResponsive(null, 'Comment updated successfully');
  }

  async deleteComment(userId: string, commentId: string, postId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const commentDeleted = await prisma.comment.deleteMany({
        where: { id: commentId, userId },
      });

      if (commentDeleted.count === 0) {
        throw new NotFoundException('Comment not found or not allowed');
      }

      await prisma.post.update({
        where: { id: postId },
        data: {
          commentCounts: { decrement: 1 },
        },
      });

      return sendResponsive(null, 'Comment deleted successfully');
    });
  }
}
