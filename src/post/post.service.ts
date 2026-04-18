import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma.service';
import { RoleEnumDto } from 'src/validators/rolesDto';
import GetAllPostsDto from './dto/get-All-posts.dto';
import { roleTeacherAndCenterSet, sendResponsive } from 'src/utils';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async getPost(postId: string, currentUserId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
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

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let isLiked = false;
    let isFollowed = false;

    if (currentUserId) {
      const [like, follow] = await Promise.all([
        this.prisma.like.findUnique({
          where: {
            userId_postId: {
              userId: currentUserId,
              postId,
            },
          },
          select: { id: true },
        }),

        this.prisma.follower.findUnique({
          where: {
            followingId_followerId: {
              followerId: currentUserId,
              followingId: post.user.id,
            },
          },
          select: { id: true },
        }),
      ]);

      isLiked = !!like;
      isFollowed = !!follow;
    }

    return sendResponsive(
      {
        ...post,
        isLiked,
        isFollowed,
      },
      'Post retrieved successfully',
    );
  }

  async getAllPosts(filters: GetAllPostsDto, userId?: string, page = 1) {
    const limit = 6;

    const posts = await this.prisma.post.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,

      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        likeCounts: true,
        commentCounts: true,
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

    const postIds = posts.map((p) => p.id);

    let likedSet = new Set<string>();

    if (userId) {
      const likes = await this.prisma.like.findMany({
        where: {
          userId,
          postId: { in: postIds },
        },
        select: {
          postId: true,
        },
      });

      likedSet = new Set(likes.map((l) => l.postId));
    }

    return sendResponsive(
      {
        posts: posts.map((post) => ({
          ...post,
          isLiked: likedSet.has(post.id),
        })),
      },
      'Posts retrieved successfully',
    );
  }

  async createPost(
    dataPostsDto: CreatePostDto,
    userId: string,
    role: RoleEnumDto,
  ) {
    if (!roleTeacherAndCenterSet.has(role)) {
      throw new ForbiddenException('Only teacher or center can create posts');
    }

    return this.prisma.$transaction(async (prisma) => {
      const [newPost] = await Promise.all([
        prisma.post.create({
          data: {
            ...dataPostsDto,
            userId,
            role,
          },
        }),

        prisma.user.update({
          where: { id: userId },
          data: {
            postCounts: { increment: 1 },
          },
        }),
      ]);

      return sendResponsive(newPost, 'Post created successfully');
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

    return sendResponsive(null, 'Post updated successfully');
  }
  async deletePost(postId: string, userId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const post = await prisma.post.deleteMany({
        where: { id: postId, userId },
      });

      if (post.count === 0) {
        throw new NotFoundException('Post not found or not authorized');
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          postCounts: {
            decrement: 1,
          },
        },
      });

      return sendResponsive(null, 'Post deleted successfully');
    });
  }
}
