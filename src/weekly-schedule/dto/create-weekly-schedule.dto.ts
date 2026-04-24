import {
  ArrayMinSize,
  ArrayMaxSize,
  IsArray,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TeacherDayDto } from './TeacherDayDto';

export class CreateWeeklyDto {
  @IsString()
  classRoom!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeacherDayDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  dataDays!: TeacherDayDto[];
}
