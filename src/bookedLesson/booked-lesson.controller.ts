import { Controller, Post, Param, Req, ParseUUIDPipe } from '@nestjs/common';
import RolesDecorator from 'src/decorator/roles.decorator';
import { BookedWeeklyService } from './booked-lesson.service';

@Controller('booked/lessons')
export class BookedWeeklyController {
  constructor(private readonly bookedService: BookedWeeklyService) {}

  @RolesDecorator('student')
  @Post(':id')
  toggleBooked(@Param('id', ParseUUIDPipe) lessonId: string, @Req() req) {
    return this.bookedService.toggleBookedStudent(req.user.profileId, lessonId);
  }
}
