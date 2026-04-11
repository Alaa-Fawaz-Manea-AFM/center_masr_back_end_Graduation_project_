import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsArray,
  Matches,
} from 'class-validator';

export class TeacherDto {
  @IsOptional()
  @Matches(/^01[0-9]{9}$/)
  whatsApp?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsArray()
  studySystem?: ('arabic' | 'english')[];

  @IsArray()
  classRooms?: string[];

  @IsString()
  studyMaterial?: string;

  @IsOptional()
  @IsString()
  educationalQualification?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  experienceYear?: number;

  @IsInt()
  @Min(0)
  sharePrice?: number;
}
