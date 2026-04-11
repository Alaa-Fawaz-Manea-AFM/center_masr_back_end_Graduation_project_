import { Module } from '@nestjs/common';
import { BookedWeeklyService } from './booked-lesson.service';
import { BookedWeeklyController } from './booked-lesson.controller';

@Module({
  controllers: [BookedWeeklyController],
  providers: [BookedWeeklyService],
})
export class BookedLessonModule {}
