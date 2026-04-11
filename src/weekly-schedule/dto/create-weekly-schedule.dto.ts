import {
  ArrayMinSize,
  ArrayMaxSize,
  IsArray,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DataDayDto } from './DataDayDto';

export class CreateWeeklyDto {
  @IsString()
  classRoom!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ValidateNested({ each: true })
  @Type(() => DataDayDto)
  dataDays!: DataDayDto[];
}
