import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  Req,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { LessonService } from './lesson.service';
import RolesDecorator from 'src/decorator/roles.decorator';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get(':lessonId')
  getLesson(@Param('lessonId', ParseUUIDPipe) lessonId: string, @Req() req) {
    return this.lessonService.getLesson(lessonId, req.user.profileId);
  }

  @Get()
  getAllLessons(
    @Query('page', ParseIntPipe) page: number,
    @Query('courseId', ParseUUIDPipe) courseId: string,
    @Req() req,
  ) {
    return this.lessonService.getAllLessons(page, req.user.profileId, courseId);
  }

  @RolesDecorator('teacher')
  @Post(':courseId')
  createLesson(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Body() createLessonDto: CreateLessonDto,
    @Req() req,
  ) {
    return this.lessonService.createLesson(
      req.user.profileId,
      courseId,
      createLessonDto,
    );
  }

  @RolesDecorator('teacher')
  @Patch(':lessonId')
  updateLesson(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @Req() req,
  ) {
    return this.lessonService.updateLesson(
      req.user.profileId,
      lessonId,
      updateLessonDto,
    );
  }

  @RolesDecorator('teacher')
  @Delete(':lessonId')
  deleteLesson(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Query('courseId', ParseUUIDPipe) courseId: string,
    @Req() req,
  ) {
    return this.lessonService.deleteLesson(
      req.user.profileId,
      lessonId,
      courseId,
    );
  }
}
