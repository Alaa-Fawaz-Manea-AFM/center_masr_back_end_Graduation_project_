import BaseDataUserDto from 'src/validators/baseDataUser';
import { CenterDto } from './centerDto';
import { StudentDto } from 'src/validators/studentDto';
import { TeacherDto } from 'src/validators/teacherDto';
import { IntersectionType, OmitType } from '@nestjs/mapped-types';

export class BaseUserDto extends OmitType(BaseDataUserDto, ['password']) {}

export class UpdateUserDto extends IntersectionType(
  BaseDataUserDto,
  TeacherDto,
  StudentDto,
  CenterDto,
) {}
