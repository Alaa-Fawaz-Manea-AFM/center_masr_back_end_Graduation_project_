import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetWeeklyScheduleDto {
  @IsNotEmpty()
  @IsString()
  classRoom!: string;
}
