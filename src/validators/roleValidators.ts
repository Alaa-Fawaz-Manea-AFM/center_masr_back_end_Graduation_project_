import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Roles } from '../utils/constant';

@ValidatorConstraint({ name: 'IsRole', async: false })
export class IsRoleConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return Roles.includes(value as any);
  }

  defaultMessage(args: ValidationArguments) {
    return `Invalid role: ${args.value}`;
  }
}
