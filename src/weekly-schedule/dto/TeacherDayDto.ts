import { Transform } from 'class-transformer';
import { IsString, Matches, IsUUID, IsIn } from 'class-validator';
import { weekDays } from 'src/utils';

export class TeacherDayDto {
  @Transform(({ value }) => value?.toLowerCase())
  @IsString()
  @IsIn(weekDays, { message: 'Invalid day' })
  day!: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'time must be in format HH:mm (00:00 - 23:59)',
  })
  time!: string;

  @IsUUID()
  teacherId!: string;

  @IsString()
  studyMaterial!: string;
}
