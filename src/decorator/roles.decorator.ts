import { SetMetadata } from '@nestjs/common';

export const role_Decorator = 'roles';
const RolesDecorator = (...roles: string[]) =>
  SetMetadata(role_Decorator, roles);

export default RolesDecorator;
