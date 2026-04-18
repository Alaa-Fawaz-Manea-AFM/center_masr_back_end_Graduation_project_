import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { HomeWorkService } from './home-work.service';
import { CreateHomeWorkDto } from './dto/create-home-work.dto';

@Controller('home-works')
export class HomeWorkController {
  constructor(private readonly homeWorkService: HomeWorkService) {}

  @Post(':lessonId')
  create(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Query('courseId', ParseUUIDPipe) courseId: string,
    @Body() createHomeWorkDto: CreateHomeWorkDto,
    @Req() req,
  ) {
    return this.homeWorkService.create(
      courseId,
      req.user.profileId,
      lessonId,
      createHomeWorkDto,
    );
  }

  @Get()
  findAll(@Query('courseId', ParseUUIDPipe) courseId, @Req() req) {
    return this.homeWorkService.findAll(courseId, req.user.profileId);
  }

  @Get(':homeWorkId')
  findOne(@Param('homeWorkId', ParseUUIDPipe) homeWorkId: string, @Req() req) {
    return this.homeWorkService.findOne(homeWorkId, req.user.profileId);
  }

  @Patch(':homeWorkId')
  update(
    @Param('homeWorkId', ParseUUIDPipe) homeWorkId: string,
    @Body() updateHomeWorkDto: CreateHomeWorkDto,
    @Req() req,
  ) {
    return this.homeWorkService.update(
      homeWorkId,
      req.user.profileId,
      updateHomeWorkDto,
    );
  }

  @Delete(':homeWorkId')
  remove(
    @Param('homeWorkId', ParseUUIDPipe) homeWorkId: string,
    @Query('courseId', ParseUUIDPipe) courseId,
    @Req() req,
  ) {
    return this.homeWorkService.remove(
      homeWorkId,
      courseId,
      req.user.profileId,
    );
  }
}
