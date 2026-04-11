import { IsUUID, IsString, IsOptional } from 'class-validator';

export class GetAllLessonDto {
  @IsUUID()
  teacherId!: string;

  @IsOptional()
  @IsString()
  classRoom!: string;

  @IsOptional()
  @IsString()
  studyMaterial!: string;
}
