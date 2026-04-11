import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import GetAllPostsDto from './dto/get-All-posts.dto';
import QueryDto from 'src/validators/query';
import { RequestType } from 'src/types/type';
import { CreatePostDto } from './dto/create-post.dto';
import { sendResponsive } from 'src/utils';
import { UpdatePostDto } from './dto/update-post.dto';
import AuthDecorator from 'src/decorator/auth.decorator';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @AuthDecorator()
  async getAllPosts(
    @Body() getAllPostsDto: GetAllPostsDto,
    @Query() queryDto: QueryDto,
    @Req() req,
  ) {
    const { page = 10 } = queryDto;
    const { userId } = req.user as RequestType;

    const posts = await this.postService.getAllPosts(
      getAllPostsDto,
      userId,
      +page,
    );

    return sendResponsive(posts, 'Posts retrieved successfully');
  }

  @Get(':id')
  async getPost(@Param('id', ParseUUIDPipe) postId: string, @Req() req: any) {
    const post = await this.postService.getPost(postId, req.user.userId);

    return sendResponsive(post, 'Post retrieved successfully');
  }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req) {
    const { userId, role } = req.user as RequestType;

    return this.postService.createPost(createPostDto, userId, role);
  }

  @Patch(':id')
  async updatePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: any,
  ) {
    const currentUserId = req.user.userId;

    const post = await this.postService.updatePost(
      id,
      currentUserId,
      updatePostDto,
    );
    return sendResponsive(post, 'Post updated successfully');
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseUUIDPipe) postId: string, @Req() req) {
    return this.postService.deletePost(postId, req.user.userId);
  }
}
