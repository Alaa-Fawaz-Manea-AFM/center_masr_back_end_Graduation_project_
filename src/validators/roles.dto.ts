import { Role } from '@prisma/client';

class RoleDto {
  role!: Role;
}

enum RoleTeacherAndCenterDto {
  TEACHER = 'teacher',
  CENTER = 'center',
}

enum RoleEnumDto {
  TEACHER = 'teacher',
  CENTER = 'center',
  STUDENT = 'student',
  ADMIN = 'admin',
}

export { RoleDto, RoleTeacherAndCenterDto, RoleEnumDto };
