import { Controller, Post, Param, Req, ParseUUIDPipe } from '@nestjs/common';
import { BookedWeeklyService } from './booked.weekly.service';

@Controller('booked/weekly-schedules')
export class BookedWeeklyController {
  constructor(private readonly bookedService: BookedWeeklyService) {}

  @Post(':id')
  toggleBooked(@Param('id', ParseUUIDPipe) teacherDayId: string, @Req() req) {
    return this.bookedService.toggleBookedStudent(
      req.user.profileId,
      teacherDayId,
    );
  }
}
