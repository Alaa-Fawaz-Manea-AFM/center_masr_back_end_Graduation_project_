import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { sendResponsive } from 'src/utils';
import { UpdateCommentDto } from './dto/update-comment.dto';
import AuthDecorator from 'src/decorator/auth.decorator';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':postId')
  @AuthDecorator()
  async getAllComments(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query('page') page: number,
  ) {
    const comments = await this.commentService.getAllComments(postId, page);
    return sendResponsive(comments, 'Comments retrieved successfully');
  }

  @Post(':postId')
  createComment(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
  ) {
    return this.commentService.createComment(
      req.user.userId,
      postId,
      createCommentDto.content,
    );
  }

  @Patch(':id')
  updateComment(
    @Param('id', ParseUUIDPipe) commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req,
  ) {
    return this.commentService.updateComment(
      req.user.userId,
      commentId,
      updateCommentDto.content,
    );
  }

  @Delete(':id')
  deleteComment(@Param('id', ParseUUIDPipe) commentId: string, @Req() req) {
    return this.commentService.deleteComment(req.user.userId, commentId);
  }
}
