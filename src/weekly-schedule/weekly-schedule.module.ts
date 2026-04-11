import { Module } from '@nestjs/common';
import { WeeklyScheduleService } from './weekly-schedule.service';
import { WeeklyScheduleController } from './weekly-schedule.controller';

@Module({
  controllers: [WeeklyScheduleController],
  providers: [WeeklyScheduleService],
})
export class WeeklyScheduleModule {}
