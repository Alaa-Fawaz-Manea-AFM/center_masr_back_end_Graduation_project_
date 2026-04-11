import { IsString, IsUUID } from 'class-validator';

export class GetWeeklyScheduleDto {
  @IsString()
  classRoom!: string;

  @IsUUID()
  centerId!: string;
}
