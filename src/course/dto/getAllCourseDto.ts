import { PickType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';

export default class GetAllCourseDto extends PickType(CreateCourseDto, [
  'classRoom',
]) {}
