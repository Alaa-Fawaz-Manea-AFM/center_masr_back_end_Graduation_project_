import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseUUIDPipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import RolesDecorator from 'src/decorator/roles.decorator';
import { TEACHER } from 'src/utils';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @RolesDecorator(TEACHER)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto, @Req() req) {
    return this.courseService.create(req.user.profileId, createCourseDto);
  }

  @Get()
  findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('teacherId', ParseUUIDPipe) teacherId,
  ) {
    return this.courseService.findAll(page, teacherId);
  }

  @Get(':id')
  findOne(@Param('lessonId', ParseUUIDPipe) lessonId: string) {
    return this.courseService.findOne(lessonId);
  }

  @RolesDecorator(TEACHER)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) lessonId: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req,
  ) {
    return this.courseService.update(
      lessonId,
      req.user.profileId,
      updateCourseDto,
    );
  }

  @RolesDecorator(TEACHER)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) courseId: string, @Req() req) {
    return this.courseService.remove(courseId, req.user.profileId);
  }
}
