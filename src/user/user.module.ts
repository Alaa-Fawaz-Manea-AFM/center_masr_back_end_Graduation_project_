import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { ProfileService } from 'src/utils/methods_handler';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ProfileService],
})
export class UserModule {}
