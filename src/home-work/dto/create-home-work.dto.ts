import { IsUrl } from 'class-validator';

export class CreateHomeWorkDto {
  @IsUrl()
  fileUrl!: string;
}
