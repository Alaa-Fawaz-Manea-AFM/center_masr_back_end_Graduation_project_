import { IsString } from 'class-validator';

export class StudentDto {
  @IsString()
  classRoom?: string;

  @IsString()
  educationalStage?: string;
}
