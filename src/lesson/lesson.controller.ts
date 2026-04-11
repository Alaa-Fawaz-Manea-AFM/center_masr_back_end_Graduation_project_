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
import { GetAllLessonDto } from './dto/getAllLessonDto';
import RolesDecorator from 'src/decorator/roles.decorator';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get(':id')
  getLesson(@Param('id', ParseUUIDPipe) lessonId: string, @Req() req) {
    return this.lessonService.getLesson(lessonId, req.user.profileId);
  }

  @Get()
  getAllLessons(
    @Query('page', ParseIntPipe) page: number,
    @Body() getAllLessons: GetAllLessonDto,
    @Req() req,
  ) {
    return this.lessonService.getAllLessons(
      req.user.profileId,
      page,
      getAllLessons,
    );
  }

  @Post()
  @RolesDecorator('teacher')
  createLesson(@Body() createLessonDto: CreateLessonDto, @Req() req) {
    return this.lessonService.createLesson(req.user.profileId, createLessonDto);
  }

  @RolesDecorator('teacher')
  @Patch(':id')
  updateLesson(
    @Param('id', ParseUUIDPipe) lessonId: string,
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
  @Delete(':id')
  deleteLesson(@Param('id', ParseUUIDPipe) lessonId: string, @Req() req) {
    return this.lessonService.deleteLesson(req.user.profileId, lessonId);
  }
}
