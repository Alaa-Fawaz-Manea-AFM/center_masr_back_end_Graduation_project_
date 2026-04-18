import { Module } from '@nestjs/common';
import { BookedLessonService } from './booked-lesson.service';
import { BookedLessonController } from './booked-lesson.controller';

@Module({
  controllers: [BookedLessonController],

  providers: [BookedLessonService],
})
export class BookedLessonModule {}
