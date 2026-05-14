import { Module } from '@nestjs/common';
import { HomeWorkService } from './home-work.service';
import { HomeWorkController } from './home-work.controller';

@Module({
  controllers: [HomeWorkController],
  providers: [HomeWorkService],
})
export class HomeWorkModule {}
