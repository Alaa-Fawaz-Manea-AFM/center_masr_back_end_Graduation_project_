import { Module } from '@nestjs/common';
import { BookedService } from './booked.service';
import { BookedController } from './booked.controller';

@Module({
  controllers: [BookedController],
  providers: [BookedService],
})
export class BookedModule {}
