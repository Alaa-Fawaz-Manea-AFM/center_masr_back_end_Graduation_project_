import { OmitType } from '@nestjs/mapped-types';
import BaseDataUserDto from 'src/validators/baseDataUser';

export default class SignUpAuthDto extends OmitType(BaseDataUserDto, [
  'address',
  'phone',
]) {}
