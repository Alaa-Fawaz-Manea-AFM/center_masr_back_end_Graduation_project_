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
  async getAllUsers(
    @Body() getAllUsersDto: GetAllUsersDto,
    @Query() queryDto: QueryDto,
  ) {
    const { page = 1, limit = 6 } = queryDto;

    const users = await this.usersService.getAllUsers(
      getAllUsersDto,
      +page,
      +limit,
    );
    return sendResponsive(users, 'Users retrieved successfully');
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUser(
    @Param('id') targetUserId: string,
    @Body('role') role: RoleTeacherAndCenterDto,
    @Req() req,
  ) {
    const user = await this.usersService.getUserById(
      targetUserId,
      role,
      req?.user?.userId,
    );

    return {
      status: 'success',
      data: user,
      message: 'User retrieved successfully',
    };
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { userData, profileData, extraProfileData } =
      this.ProfileService.buildProfileData(updateUserDto.role, updateUserDto);

    const user = await this.usersService.updateUser(
      id,
      updateUserDto.role,
      userData,
      profileData,
      extraProfileData,
    );
    return {
      status: 'success',
      data: user,
      message: 'User updated successfully',
    };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return { status: 'success', message: 'User deleted successfully' };
  }
}
