import { IsString, Matches, IsUUID } from 'class-validator';

export class DataDayDto {
  @IsString()
  day!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  time!: string;

  @IsUUID()
  teacherId!: string;

  @IsString()
  studyMaterial!: string;
}
