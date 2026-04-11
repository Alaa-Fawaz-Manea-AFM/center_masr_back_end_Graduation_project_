import { Role } from '@prisma/client';
import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
  IsEnum,
} from 'class-validator';
import EmailAndPassDto from './emailAndpassDto';

export default class BaseDataUserDto extends EmailAndPassDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @IsEnum(Role)
  role!: Role;

  @IsOptional()
  @IsString()
  imageUrl!: string;

  @Matches(/^01[0-9]{9}$/, {
    message: 'invalid Egyptian phone number',
  })
  phone!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  address!: string;
}
