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
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import AuthDecorator from 'src/decorator/auth.decorator';

@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post(':lessonId')
  create(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Query('courseId', ParseUUIDPipe) courseId: string,
    @Body() createExamDto: CreateExamDto,
    @Req() req,
  ) {
    return this.examService.create(
      req.user.profileId,
      lessonId,
      courseId,
      createExamDto,
    );
  }

  @Get()
  findAll(@Query('courseId', ParseUUIDPipe) courseId: string, @Req() req) {
    return this.examService.findAll(courseId, req.user.profileId);
  }

  @Get(':examId')
  findOne(@Param('examId', ParseUUIDPipe) examId: string, @Req() req) {
    return this.examService.findOne(req.user.profileId, examId);
  }

  @Patch(':examId')
  update(
    @Param('examId', ParseUUIDPipe) examId: string,
    @Body() updateExamDto: CreateExamDto,
    @Req() req,
  ) {
    return this.examService.update(examId, req.user.profileId, updateExamDto);
  }

  @Delete(':examId')
  remove(
    @Param('examId', ParseUUIDPipe) examId: string,
    @Query('courseId', ParseUUIDPipe) courseId: string,
    @Req() req,
  ) {
    return this.examService.remove(req.user.profileId, examId, courseId);
  }
}
