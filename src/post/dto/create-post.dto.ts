import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(500)
  content!: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
