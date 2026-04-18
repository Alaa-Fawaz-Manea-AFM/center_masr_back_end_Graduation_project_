import { IsUrl } from 'class-validator';

export class CreateExamDto {
  @IsUrl()
  fileUrl!: string;
}
