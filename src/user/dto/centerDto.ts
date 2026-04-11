import { IsArray, IsOptional, IsString, Matches } from 'class-validator';

export class CenterDto {
  @IsOptional()
  @Matches(/^01[0-9]{9}$/)
  whatsApp?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsString()
  governorate?: string;

  @IsArray()
  studySystem?: ('arabic' | 'english')[];

  @IsArray()
  studyMaterials?: string[];

  @IsOptional()
  @IsArray()
  contactUsPhone?: string[];

  @IsArray()
  educationalStage?: string[];

  @IsOptional()
  @IsArray()
  contactUsEmail?: string[];
}
