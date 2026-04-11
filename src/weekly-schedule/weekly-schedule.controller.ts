import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { WeeklyScheduleService } from './weekly-schedule.service';
import { GetWeeklyScheduleDto } from './dto/GetWeeklyScheduleDto';
import { CreateWeeklyDto } from './dto/create-weekly-schedule.dto';
import RolesDecorator from 'src/decorator/roles.decorator';
import { CENTER } from 'src/utils';

@Controller('weekly-schedule')
export class WeeklyScheduleController {
  constructor(private readonly service: WeeklyScheduleService) {}

  @Get()
  getWeeklySchedule(@Query() query: GetWeeklyScheduleDto, @Req() req) {
    return this.service.getWeeklySchedule(
      query.centerId,
      query.classRoom,
      req.user?.profileId,
      req.user?.role,
    );
  }

  @RolesDecorator(CENTER)
  @Post()
  createWeeklySchedule(
    @Body() createWeeklyScheduleDto: CreateWeeklyDto,
    @Req() req,
  ) {
    return this.service.createWeekly(
      req.user.profileId,
      createWeeklyScheduleDto,
    );
  }

  @RolesDecorator(CENTER)
  @Patch(':id')
  updateWeeklySchedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: any,
    @Req() req,
  ) {
    return this.service.updateWeeklySchedule(id, body, req.user.profileId);
  }

  @RolesDecorator(CENTER)
  @Delete(':id')
  deleteWeeklySchedule(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    return this.service.deleteWeeklySchedule(id, req.user.profileId);
  }
}
