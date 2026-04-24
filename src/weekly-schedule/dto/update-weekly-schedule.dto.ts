import { PartialType, OmitType } from '@nestjs/mapped-types';
import { TeacherDayDto } from './TeacherDayDto';

export class UpdateWeeklyDto extends PartialType(
  OmitType(TeacherDayDto, ['day']),
) {}
