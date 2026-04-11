import { Controller, Post, Param, Req, ParseUUIDPipe } from '@nestjs/common';
import { BookedService } from './booked.service';

@Controller('booked/weekly-schedules')
export class BookedController {
  constructor(private readonly bookedService: BookedService) {}

  @Post(':id')
  toggleBooked(@Param('id', ParseUUIDPipe) teacherDayId: string, @Req() req) {
    return this.bookedService.toggleBookedStudent(
      req.user.profileId,
      teacherDayId,
    );
  }
}
