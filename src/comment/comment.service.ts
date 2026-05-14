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
        postId,
        nextCursor:
          comments.length === limit ? comments[comments.length - 1].id : null,
        data: comments,
      },
      'Comments retrieved successfully',
    );
  }

  async createComment(userId: string, postId: string, content: string) {
    return await this.prisma.$transaction(async (prisma) => {
      const post = await prisma.post.findUnique({
        where: { id_userId: { id: postId, userId } },
        select: { id: true },
      });

      if (!post) throw new NotFoundException('Post not found');

      const comment = await prisma.comment.create({
        data: { userId, postId, content },
      });

      if (!comment) throw new NotFoundException('Post not found');

      await prisma.post.update({
        where: { id_userId: { id: postId, userId } },
        data: {
          commentCounts: { increment: 1 },
        },
      });

      return sendResponsive(comment, 'Comment created successfully');
    });
  }
  async updateComment(
    userId: string,
    commentId: string,
    postId: string,
    content: string,
  ) {
    await this.prisma.comment.update({
      where: {
        id_userId_postId: {
          id: commentId,
          userId,
          postId,
        },
      },
      data: {
        content,
      },
    });

    return sendResponsive(null, 'Comment updated successfully');
  }

  async deleteComment(userId: string, commentId: string, postId: string) {
    return await this.prisma.$transaction(async (prisma) => {
      await Promise.all([
        prisma.comment.delete({
          where: {
            id_userId_postId: {
              id: commentId,
              userId,
              postId,
            },
          },
        }),
        prisma.post.update({
          where: { id_userId: { id: postId, userId } },
          data: {
            commentCounts: {
              decrement: 1,
            },
          },
        }),
      ]);

      return sendResponsive(null, 'Comment deleted successfully');
    });
  }
}
