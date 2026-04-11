import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma.service';
import { RoleEnumDto } from 'src/validators/rolesDto';
import GetAllPostsDto from './dto/get-All-posts.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async getPost(postId: string, currentUserId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,

            followers: currentUserId
              ? {
                  where: {
                    followerId: currentUserId,
                  },
                  select: { id: true },
                }
              : false,
          },
        },

        likes: currentUserId
          ? {
              where: { userId: currentUserId },
              select: { id: true },
            }
          : false,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return {
      ...post,
      isLiked: currentUserId ? post.likes.length > 0 : false,

      user: {
        ...post.user,
        isFollowed: currentUserId ? post.user.followers.length > 0 : false,
        followers: undefined,
      },

      likes: undefined,
    };
  }

  async getAllPosts(filters: GetAllPostsDto, userId?: string, page = 1) {
    const limit = 6;

    const posts = await this.prisma.post.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },

        likes: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
      },
    });

    return posts.map((post) => ({
      ...post,
      isLiked: userId ? post.likes.length > 0 : false,
      likes: undefined,
    }));
  }

  async createPost(
    dataPostsDto: CreatePostDto,
    userId: string,
    role: RoleEnumDto,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          postCounts: { increment: 1 },
        },
        select: {
          id: true,
          postCounts: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const newPost = await prisma.post.create({
        data: {
          ...dataPostsDto,
          userId,
          role,
        },
      });

      if (!newPost) {
        throw new NotFoundException('Error creating post');
      }

      return newPost;
    });
  }

  async updatePost(postId: string, userId: string, data: UpdatePostDto) {
    const result = await this.prisma.post.updateMany({
      where: {
        id: postId,
        userId,
      },
      data,
    });

    if (result.count === 0) {
      throw new NotFoundException('Post not found or not authorized');
    }

    return;
  }

  async deletePost(postId: string, userId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const deletedPost = await prisma.post.deleteMany({
        where: {
          id: postId,
          userId,
        },
      });

      if (deletedPost.count === 0) {
        throw new NotFoundException('Post not found or not authorized');
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          postCounts: { decrement: 1 },
        },
      });

      return { message: 'Post deleted successfully' };
    });
  }
}
