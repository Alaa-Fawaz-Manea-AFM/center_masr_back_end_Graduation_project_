import { Module } from '@nestjs/common';
import { BookedWeeklyController } from './booked.weekly.controller';
import { BookedWeeklyService } from './booked.weekly.service';

@Module({
  controllers: [BookedWeeklyController],
  providers: [BookedWeeklyService],
})
export class BookedWeeklyModule {}
