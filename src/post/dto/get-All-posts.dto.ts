import { IsIn, IsUUID } from 'class-validator';
import { roleTeacherAndCenter } from 'src/utils/constant';
import { RoleTeacherAndCenterDto } from 'src/validators/rolesDto';

class GetAllPostsDto {
  @IsIn(roleTeacherAndCenter)
  role!: RoleTeacherAndCenterDto;

  @IsUUID()
  userId!: string;
}

export default GetAllPostsDto;
