import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { sendResponsive } from 'src/utils';
import { GetAllUsersDto } from './dto/getAllUsersDto';
import QueryDto from 'src/validators/query';
import { ProfileService } from 'src/utils/methods_handler';
import { AuthGuard } from 'src/guard/authGuard';
import { RoleTeacherAndCenterDto } from 'src/validators/rolesDto';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,

    private ProfileService: ProfileService,
  ) {}

  @Get()
  getAllUsers(
    @Body() getAllUsersDto: GetAllUsersDto,
    @Query() queryDto: QueryDto,
  ) {
    const { page = 1, limit = 6 } = queryDto;

    return this.usersService.getAllUsers(getAllUsersDto, +page, +limit);
  }

  @Get(':id')
  getUser(
    @Param('id', ParseUUIDPipe) targetUserId: string,
    @Body('role') role: RoleTeacherAndCenterDto,
    @Req() req,
  ) {
    return this.usersService.getUserById(targetUserId, role, req?.user?.userId);
  }

  @Patch(':userId')
  updateUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { userData, profileData, extraProfileData } =
      this.ProfileService.buildProfileData(updateUserDto.role, updateUserDto);

    return this.usersService.updateUser(
      userId,
      updateUserDto.role,
      userData,
      profileData,
      extraProfileData,
    );
  }

  @Delete(':userId')
  deleteUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
